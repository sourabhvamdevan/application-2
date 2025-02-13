export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  apiKey: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setApiKey: (key: string) => void;
  setLoading: (loading: boolean) => void;
}