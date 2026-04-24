import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  // User
  saveUser: async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.log('Save user error:', error);
    }
  },

  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.log('Get user error:', error);
      return null;
    }
  },

  removeUser: async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.log('Remove user error:', error);
    }
  },

  // Chats Cache
  saveChats: async (chats) => {
    try {
      await AsyncStorage.setItem('chats', JSON.stringify(chats));
    } catch (error) {
      console.log('Save chats error:', error);
    }
  },

  getChats: async () => {
    try {
      const chats = await AsyncStorage.getItem('chats');
      return chats ? JSON.parse(chats) : [];
    } catch (error) {
      console.log('Get chats error:', error);
      return [];
    }
  },

  // Messages Cache
  saveMessages: async (chatId, messages) => {
    try {
      await AsyncStorage.setItem(`messages-${chatId}`, JSON.stringify(messages));
    } catch (error) {
      console.log('Save messages error:', error);
    }
  },

  getMessages: async (chatId) => {
    try {
      const messages = await AsyncStorage.getItem(`messages-${chatId}`);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.log('Get messages error:', error);
      return [];
    }
  },

  // Settings
  saveSetting: async (key, value) => {
    try {
      await AsyncStorage.setItem(`setting-${key}`, JSON.stringify(value));
    } catch (error) {
      console.log('Save setting error:', error);
    }
  },

  getSetting: async (key, defaultValue) => {
    try {
      const value = await AsyncStorage.getItem(`setting-${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.log('Get setting error:', error);
      return defaultValue;
    }
  },

  // Clear all
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('Clear all error:', error);
    }
  }
};

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const truncateText = (text, maxLength = 50) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const generateInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};
