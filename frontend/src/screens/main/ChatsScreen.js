import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  RefreshControl,
  StatusBar,
  TextInput,
  Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useChatStore } from '../../context/chatStore';
import { chatService, userService } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

const ChatsScreen = ({ navigation }) => {
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredChats(
        chats.filter((chat) =>
          (chat.groupName || chat.participants[0].username)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredChats(chats);
    }
  }, [searchQuery, chats]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getAllChats();
      setChats(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat) => {
    navigation.navigate('ChatDetail', {
      chatId: chat._id,
      chatName: chat.groupName || chat.participants[0].username
    });
  };

  const renderChatItem = ({ item }) => {
    const otherUser = item.participants.find((p) => p._id !== item.sender);
    const lastMessageText = item.lastMessage?.text || 'No messages';
    const lastMessageTime = item.lastMessage?.createdAt
      ? formatDistanceToNow(new Date(item.lastMessage.createdAt), { addSuffix: true })
      : '';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item)}
      >
        <Image
          source={{
            uri: item.groupIcon || otherUser?.avatar || 'https://via.placeholder.com/50'
          }}
          style={styles.avatar}
        />
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>
            {item.groupName || otherUser?.username}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>
        <View style={styles.chatTime}>
          <Text style={styles.timeText}>{lastMessageTime}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadChats} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="message-outline"
              size={60}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No chats yet</Text>
            <Text style={styles.emptySubtext}>Start a new conversation</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#f0f0f0'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 12
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000'
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center'
  },
  chatName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4
  },
  lastMessage: {
    fontSize: 13,
    color: '#999',
    maxWidth: '90%'
  },
  chatTime: {
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8
  },
  badge: {
    backgroundColor: '#0084ff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8
  }
});

export default ChatsScreen;
