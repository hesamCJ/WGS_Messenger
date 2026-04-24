import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://your-server-url:5000/api';

const getAuthToken = async () => {
  return await SecureStore.getItemAsync('authToken');
};

const createAuthHeader = async () => {
  const token = await getAuthToken();
  return {
    Authorization: `Bearer ${token}`
  };
};

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    return response.data;
  },

  logout: async () => {
    const headers = await createAuthHeader();
    const response = await axios.post(`${API_URL}/auth/logout`, {}, { headers });
    return response.data;
  }
};

// User Services
export const userService = {
  getProfile: async () => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/users/profile`, { headers });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const headers = await createAuthHeader();
    const response = await axios.put(`${API_URL}/users/profile`, profileData, {
      headers
    });
    return response.data;
  },

  searchUsers: async (query) => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/users/search`, {
      params: { query },
      headers
    });
    return response.data;
  },

  getUserById: async (userId) => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/users/${userId}`, { headers });
    return response.data;
  },

  addContact: async (contactId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/users/contact/add`,
      { contactId },
      { headers }
    );
    return response.data;
  },

  blockUser: async (userId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/users/block`,
      { userId },
      { headers }
    );
    return response.data;
  },

  unblockUser: async (userId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/users/unblock`,
      { userId },
      { headers }
    );
    return response.data;
  }
};

// Chat Services
export const chatService = {
  getOrCreateChat: async (userId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/chats/private`,
      { userId },
      { headers }
    );
    return response.data;
  },

  getAllChats: async () => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/chats`, { headers });
    return response.data;
  },

  createGroup: async (groupData) => {
    const headers = await createAuthHeader();
    const response = await axios.post(`${API_URL}/chats/group`, groupData, {
      headers
    });
    return response.data;
  },

  updateGroup: async (chatId, groupData) => {
    const headers = await createAuthHeader();
    const response = await axios.put(
      `${API_URL}/chats/${chatId}`,
      groupData,
      { headers }
    );
    return response.data;
  },

  addGroupMember: async (chatId, userId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/member/add`,
      { userId },
      { headers }
    );
    return response.data;
  },

  removeGroupMember: async (chatId, userId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/member/remove`,
      { userId },
      { headers }
    );
    return response.data;
  },

  leaveGroup: async (chatId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/leave`,
      {},
      { headers }
    );
    return response.data;
  },

  archiveChat: async (chatId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/archive`,
      {},
      { headers }
    );
    return response.data;
  },

  muteChat: async (chatId, duration) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/mute`,
      { duration },
      { headers }
    );
    return response.data;
  },

  pinMessage: async (chatId, messageId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/chats/${chatId}/pin`,
      { messageId },
      { headers }
    );
    return response.data;
  }
};

// Message Services
export const messageService = {
  sendMessage: async (chatId, messageData) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/messages`,
      { chat: chatId, ...messageData },
      { headers }
    );
    return response.data;
  },

  getMessages: async (chatId, page = 1, limit = 50) => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/messages/${chatId}`, {
      params: { page, limit },
      headers
    });
    return response.data;
  },

  editMessage: async (messageId, text) => {
    const headers = await createAuthHeader();
    const response = await axios.put(
      `${API_URL}/messages/${messageId}`,
      { text },
      { headers }
    );
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const headers = await createAuthHeader();
    const response = await axios.delete(`${API_URL}/messages/${messageId}`, {
      headers
    });
    return response.data;
  },

  reactToMessage: async (messageId, emoji) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/messages/${messageId}/react`,
      { emoji },
      { headers }
    );
    return response.data;
  },

  markAsRead: async (messageId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/messages/${messageId}/read`,
      {},
      { headers }
    );
    return response.data;
  },

  forwardMessage: async (messageId, chatIds) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/messages/forward`,
      { messageId, chatIds },
      { headers }
    );
    return response.data;
  },

  searchMessages: async (chatId, query) => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/messages/search`, {
      params: { chatId, query },
      headers
    });
    return response.data;
  }
};

// Call Services
export const callService = {
  initiateCall: async (receiverId, type) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/calls`,
      { receiverId, type },
      { headers }
    );
    return response.data;
  },

  answerCall: async (callId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/calls/${callId}/answer`,
      {},
      { headers }
    );
    return response.data;
  },

  rejectCall: async (callId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/calls/${callId}/reject`,
      {},
      { headers }
    );
    return response.data;
  },

  endCall: async (callId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/calls/${callId}/end`,
      {},
      { headers }
    );
    return response.data;
  },

  getCallHistory: async (userId) => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/calls/${userId}/history`, {
      headers
    });
    return response.data;
  }
};

// Story Services
export const storyService = {
  createStory: async (storyData) => {
    const headers = await createAuthHeader();
    const response = await axios.post(`${API_URL}/stories`, storyData, {
      headers
    });
    return response.data;
  },

  getStories: async () => {
    const headers = await createAuthHeader();
    const response = await axios.get(`${API_URL}/stories`, { headers });
    return response.data;
  },

  viewStory: async (storyId) => {
    const headers = await createAuthHeader();
    const response = await axios.post(
      `${API_URL}/stories/${storyId}/view`,
      {},
      { headers }
    );
    return response.data;
  },

  deleteStory: async (storyId) => {
    const headers = await createAuthHeader();
    const response = await axios.delete(`${API_URL}/stories/${storyId}`, {
      headers
    });
    return response.data;
  },

  getStoryViewers: async (storyId) => {
    const headers = await createAuthHeader();
    const response = await axios.get(
      `${API_URL}/stories/${storyId}/viewers`,
      { headers }
    );
    return response.data;
  }
};
