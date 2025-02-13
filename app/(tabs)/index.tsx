import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OpenAI from 'openai';
import ChatMessage from '../../components/ChatMessage';
import ChatInput from '../../components/ChatInput';
import { useChatStore } from '../../store/chat';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { messages, isLoading, apiKey, addMessage, setLoading } = useChatStore();

  const handleSend = async (content: string) => {
    if (!apiKey) {
      addMessage({
        role: 'assistant',
        content: 'Please set your OpenAI API key in the Settings tab first.',
      });
      return;
    }

    addMessage({ role: 'user', content });
    setLoading(true);

    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...messages.map(({ role, content }) => ({ role, content })),
          { role: 'user', content },
        ],
      });

      const assistantMessage = response.choices[0]?.message?.content;
      if (assistantMessage) {
        addMessage({ role: 'assistant', content: assistantMessage });
      }
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatMessage message={item} />}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  messageList: {
    paddingVertical: 16,
  },
});