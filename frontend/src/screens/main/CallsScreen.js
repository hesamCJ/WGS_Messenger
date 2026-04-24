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
import { callService } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

const CallsScreen = ({ navigation }) => {
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      // Get current user ID from storage
      const response = await callService.getCallHistory('userId');
      setCallHistory(response.calls);
    } catch (error) {
      Alert.alert('Error', 'Failed to load call history');
    } finally {
      setLoading(false);
    }
  };

  const renderCallItem = ({ item }) => {
    const isIncoming = item.type === 'incoming';
    const otherUser = isIncoming ? item.caller : item.receiver;
    const statusIcon =
      item.status === 'completed'
        ? 'check'
        : item.status === 'missed'
        ? 'phone-missed'
        : 'phone-off';

    const callTypeIcon = item.type === 'video' ? 'video' : 'phone';

    return (
      <TouchableOpacity style={styles.callItem}>
        <Image
          source={{
            uri: otherUser?.avatar || 'https://via.placeholder.com/50'
          }}
          style={styles.avatar}
        />
        <View style={styles.callInfo}>
          <Text style={styles.userName}>{otherUser?.username}</Text>
          <View style={styles.callDetails}>
            <MaterialCommunityIcons
              name={statusIcon}
              size={14}
              color={item.status === 'completed' ? '#0084ff' : '#999'}
            />
            <Text style={styles.callStatus}>
              {item.status === 'completed'
                ? `${Math.floor(item.duration / 60)}m ${item.duration % 60}s`
                : item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.callTime}>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </Text>
        <TouchableOpacity style={styles.callButton}>
          <MaterialCommunityIcons
            name={callTypeIcon}
            size={20}
            color="#0084ff"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={callHistory}
        renderItem={renderCallItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={callHistory.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={60}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No calls yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  callItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  callInfo: {
    flex: 1
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  callStatus: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4
  },
  callTime: {
    fontSize: 12,
    color: '#999',
    marginRight: 12
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12
  }
});

export default CallsScreen;
