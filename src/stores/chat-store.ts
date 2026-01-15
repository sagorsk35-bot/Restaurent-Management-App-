'use client'

import { create } from 'zustand'
import type { ChatState } from '@/types'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

interface ChatStoreState extends ChatState {
  isOpen: boolean

  // Actions
  openChat: (restaurantId?: string) => void
  closeChat: () => void
  toggleChat: () => void
  setConversationId: (id: string) => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setMessages: (messages: ChatMessage[]) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  conversationId: null,
  restaurantId: null,
  messages: [],
  isLoading: false,
  isOpen: false,

  openChat: (restaurantId) =>
    set({
      isOpen: true,
      restaurantId: restaurantId || null,
      messages: restaurantId !== get().restaurantId ? [] : get().messages,
      conversationId:
        restaurantId !== get().restaurantId ? null : get().conversationId,
    }),

  closeChat: () => set({ isOpen: false }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  setConversationId: (id) => set({ conversationId: id }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: generateMessageId(),
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () =>
    set({
      conversationId: null,
      restaurantId: null,
      messages: [],
      isLoading: false,
      isOpen: false,
    }),
}))
