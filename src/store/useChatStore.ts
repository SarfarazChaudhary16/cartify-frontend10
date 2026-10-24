import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { chatHistory } from '@/mocks/reviews'
import type { ChatMessage } from '@/types'

type AgentMode = 'ai' | 'agent'

interface ChatState {
  messages: ChatMessage[]
  mode: AgentMode
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setMode: (mode: AgentMode) => void
  clearHistory: () => void
}

/** Chat widget state — persisted so the conversation survives a page reload, like a real support chat would. */
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: chatHistory,
      mode: 'ai',
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date().toISOString() }],
        })),
      setMode: (mode) => set({ mode }),
      clearHistory: () => set({ messages: [] }),
    }),
    { name: 'cartify-chat' },
  ),
)