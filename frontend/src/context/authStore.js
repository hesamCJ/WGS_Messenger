import create from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = 'http://your-server-url:5000/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  loading: true,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;

      await SecureStore.setItemAsync('authToken', token);
      
      set({
        user,
        token,
        isLoggedIn: true,
        loading: false
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  login: async (username, password) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync('authToken', token);

      set({
        user,
        token,
        isLoggedIn: true,
        loading: false
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      set({
        user: null,
        token: null,
        isLoggedIn: false
      });
      return { success: true };
    } catch (error) {
      console.log('Logout error:', error);
      return { success: false };
    }
  },

  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

  updateUserProfile: async (profileData) => {
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.put(
        `${API_URL}/users/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      set({ user: response.data.user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      set({ error: message });
      return { success: false, error: message };
    }
  }
}));
