import { useEffect } from 'react';
import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

let socket = null;

export const initializeSocket = async () => {
  const token = await SecureStore.getItemAsync('authToken');
  
  socket = io('http://your-server-url:5000', {
    auth: {
      token
    },
    reconect: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;

export const useSocket = (userId) => {
  useEffect(() => {
    if (socket) {
      socket.emit('user-online', userId);
      
      return () => {
        socket.emit('user-offline', userId);
      };
    }
  }, [userId]);

  return socket;
};

export const socketEvents = {
  // Send events
  sendPrivateMessage: (to, message) => {
    socket?.emit('private-message', { to, message, timestamp: Date.now() });
  },
  
  sendGroupMessage: (groupId, message) => {
    socket?.emit('group-message', { groupId, message });
  },

  sendTypingIndicator: (chatId, userId, isTyping) => {
    socket?.emit('typing', { chatId, userId, isTyping });
  },

  markMessageAsRead: (messageId, chatId) => {
    socket?.emit('message-read', { messageId, chatId });
  },

  initiateCall: (to, from, type) => {
    socket?.emit('call-initiated', { to, from, type });
  },

  joinGroup: (groupId) => {
    socket?.emit('join-group', groupId);
  },

  leaveGroup: (groupId) => {
    socket?.emit('leave-group', groupId);
  },

  // Listen events
  onMessageReceived: (callback) => {
    socket?.on('receive-message', callback);
  },

  onGroupMessageReceived: (callback) => {
    socket?.on('receive-group-message', callback);
  },

  onUserTyping: (callback) => {
    socket?.on('user-typing', callback);
  },

  onIncomingCall: (callback) => {
    socket?.on('incoming-call', callback);
  },

  onUserStatusChanged: (callback) => {
    socket?.on('user-status', callback);
  },

  onMessageReadReceipt: (callback) => {
    socket?.on('message-read-receipt', callback);
  }
};
