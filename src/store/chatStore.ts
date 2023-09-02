import { create } from 'zustand'
import { Message } from 'ai'

interface MessageState {
  history: Message[]
  setHistory: (messages: Message[]) => void
}

export const useMessagesStore = create<MessageState>((set) => ({
  history: [],
  setHistory: (messages: Message[]) =>
    set({
      history: messages,
    }),
}))
