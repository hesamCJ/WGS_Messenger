import create from 'zustand';

export const useChatStore = create((set) => ({
  chats: [],
  messages: {},
  selectedChatId: null,
  loading: false,

  setChats: (chats) => set({ chats }),
  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: messages
      }
    })),
  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message]
      }
    })),
  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
  setLoading: (loading) => set({ loading }),

  updateMessage: (chatId, messageId, updatedMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId]?.map((msg) =>
          msg._id === messageId ? updatedMessage : msg
        ) || []
      }
    })),

  deleteMessage: (chatId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId]?.filter((msg) => msg._id !== messageId) || []
      }
    }))
}));

export const useCallStore = create((set) => ({
  incomingCall: null,
  outgoingCall: null,
  callHistory: [],

  setIncomingCall: (call) => set({ incomingCall: call }),
  setOutgoingCall: (call) => set({ outgoingCall: call }),
  setCallHistory: (history) => set({ callHistory: history }),
  clearIncomingCall: () => set({ incomingCall: null }),
  clearOutgoingCall: () => set({ outgoingCall: null })
}));

export const useStoryStore = create((set) => ({
  stories: [],
  userStories: [],
  viewedStories: [],

  setStories: (stories) => set({ stories }),
  setUserStories: (stories) => set({ userStories: stories }),
  addViewedStory: (storyId) =>
    set((state) => ({
      viewedStories: [...state.viewedStories, storyId]
    }))
}));
