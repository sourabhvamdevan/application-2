import { create } from 'zustand';
import { ChatState, Message } from '../types/chat';
import OpenAI from 'openai';

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  apiKey: '',
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  setApiKey: (key) => set({ apiKey: key }),
  setLoading: (loading) => set({ isLoading: loading }),
}));