import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useChatStore } from '../../context/chatStore';
import { messageService } from '../../services/api';

const ChatDetailScreen = ({ route, navigation }) => {
  const { chatId } = route.params;
  const messages = useChatStore((state) => state.messages[chatId] || []);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);

  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages(chatId);
      setMessages(chatId, data.messages || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const newMessage = await messageService.sendMessage(chatId, {
        text: messageText
      });
      addMessage(chatId, newMessage);
      setMessageText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwn = item.sender._id === item.sender._id; // Should compare with current user

    return (
      <View
        style={[
          styles.messageBubble,
          isOwn ? styles.ownMessage : styles.otherMessage
        ]}
      >
        {!isOwn && (
          <Image
            source={{
              uri: item.sender.avatar || 'https://via.placeholder.com/30'
            }}
            style={styles.senderAvatar}
          />
        )}
        <View
          style={[
            styles.messageContent,
            isOwn ? styles.ownContent : styles.otherContent
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwn ? styles.ownText : styles.otherText
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isOwn ? styles.ownTime : styles.otherTime
            ]}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        inverted
        onEndReachedThreshold={0.5}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color="#0084ff"
            />
          </TouchableOpacity>
          <TextInput
            style={styles.messageInput}
            placeholder="Aa"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="emoticon-happy"
              size={24}
              color="#0084ff"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          <MaterialCommunityIcons
            name={sending ? 'clock' : 'send'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  messageBubble: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 6,
    alignItems: 'flex-end'
  },
  ownMessage: {
    justifyContent: 'flex-end'
  },
  otherMessage: {
    justifyContent: 'flex-start'
  },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8
  },
  messageContent: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16
  },
  ownContent: {
    backgroundColor: '#0084ff'
  },
  otherContent: {
    backgroundColor: '#e5e5ea'
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20
  },
  ownText: {
    color: '#fff'
  },
  otherText: {
    color: '#000'
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)'
  },
  otherTime: {
    color: '#999'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#fff'
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 8
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    fontSize: 15,
    maxHeight: 100
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  }
});

export default ChatDetailScreen;
