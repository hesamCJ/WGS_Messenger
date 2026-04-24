import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  StatusBar
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { storyService } from '../../services/api';

const StoriesScreen = ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await storyService.getStories();
      setStories(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStory = async (storyId) => {
    try {
      await storyService.viewStory(storyId);
      navigation.navigate('StoryViewer', { storyId });
    } catch (error) {
      Alert.alert('Error', 'Failed to view story');
    }
  };

  const renderStoryItem = ({ item }) => {
    const viewedCount = item.viewedBy?.length || 0;

    return (
      <TouchableOpacity
        style={styles.storyItem}
        onPress={() => handleViewStory(item._id)}
      >
        <Image
          source={{
            uri: item.media || 'https://via.placeholder.com/100'
          }}
          style={styles.storyImage}
        />
        <View style={styles.storyOverlay}>
          <Image
            source={{
              uri: item.user?.avatar || 'https://via.placeholder.com/40'
            }}
            style={styles.userAvatar}
          />
          <View style={styles.storyInfo}>
            <Text style={styles.userName}>{item.user?.username}</Text>
            <Text style={styles.viewCount}>
              {viewedCount} {viewedCount === 1 ? 'view' : 'views'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <FlatList
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="circle-outline"
              size={60}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No stories</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab}>
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
  listContent: {
    padding: 8
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8
  },
  storyItem: {
    width: '48%',
    aspectRatio: 0.65,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee'
  },
  storyImage: {
    width: '100%',
    height: '100%'
  },
  storyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center'
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff'
  },
  storyInfo: {
    flex: 1
  },
  userName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  viewCount: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 2
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12
  }
});

export default StoriesScreen;
