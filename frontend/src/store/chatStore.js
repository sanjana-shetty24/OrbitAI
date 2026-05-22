import { create } from 'zustand'
import {
  createNewChat, sendMessage, fetchHistory,
  fetchChat, deleteChat, renameChat, clearAllChats
} from '../utils/api'
import toast from 'react-hot-toast'

export const useChatStore = create((set, get) => ({
  // State
  chats: [],            // sidebar list
  activeChatId: null,
  activeChat: null,     // full chat with messages
  isLoading: false,
  isTyping: false,
  sidebarOpen: true,

  // ── Sidebar ────────────────────────────────────────────────
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (v) => set({ sidebarOpen: v }),

  // ── Load history ──────────────────────────────────────────
  loadHistory: async () => {
    try {
      const chats = await fetchHistory()
      set({ chats })
    } catch {
      // Backend may not be running — silently skip
    }
  },

  // ── New chat ──────────────────────────────────────────────
  newChat: async () => {
    try {
      const chat = await createNewChat()
      set(s => ({
        chats: [{ ...chat, message_count: 0, preview: '' }, ...s.chats],
        activeChatId: chat.id,
        activeChat: chat,
      }))
      return chat
    } catch {
      toast.error('Could not create chat — is the backend running?')
    }
  },

  // ── Select chat ───────────────────────────────────────────
  selectChat: async (chatId) => {
    if (get().activeChatId === chatId) return
    set({ isLoading: true, activeChatId: chatId })
    try {
      const chat = await fetchChat(chatId)
      set({ activeChat: chat, isLoading: false })
    } catch {
      set({ isLoading: false })
      toast.error('Failed to load chat')
    }
  },

  // ── Send message ──────────────────────────────────────────
  sendMessage: async (text) => {
    const { activeChatId, activeChat } = get()
    if (!activeChatId || !text.trim()) return

    // Optimistic user bubble
    const tempUserMsg = {
      id: `tmp-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    set(s => ({
      activeChat: { ...s.activeChat, messages: [...(s.activeChat?.messages || []), tempUserMsg] },
      isTyping: true,
    }))

    try {
      const data = await sendMessage(activeChatId, text)
      // Replace active chat with server version (has real IDs + AI message)
      set(s => ({
        activeChat: data.chat,
        isTyping: false,
        chats: s.chats.map(c =>
          c.id === activeChatId
            ? { ...c, title: data.chat.title, preview: data.message.content.slice(0, 80), updated_at: data.chat.updated_at, message_count: data.chat.messages.length }
            : c
        ),
      }))
    } catch {
      set(s => ({
        activeChat: { ...s.activeChat, messages: s.activeChat.messages.filter(m => m.id !== tempUserMsg.id) },
        isTyping: false,
      }))
      toast.error('Failed to send message')
    }
  },

  // ── Delete chat ───────────────────────────────────────────
  deleteChat: async (chatId) => {
    try {
      await deleteChat(chatId)
      set(s => {
        const chats = s.chats.filter(c => c.id !== chatId)
        const activeChatId = s.activeChatId === chatId ? null : s.activeChatId
        const activeChat   = s.activeChatId === chatId ? null : s.activeChat
        return { chats, activeChatId, activeChat }
      })
      toast.success('Chat deleted')
    } catch {
      toast.error('Failed to delete chat')
    }
  },

  // ── Rename chat ───────────────────────────────────────────
  renameChat: async (chatId, title) => {
    try {
      await renameChat(chatId, title)
      set(s => ({
        chats: s.chats.map(c => c.id === chatId ? { ...c, title } : c),
        activeChat: s.activeChat?.id === chatId ? { ...s.activeChat, title } : s.activeChat,
      }))
    } catch {
      toast.error('Failed to rename chat')
    }
  },

  // ── Clear all ─────────────────────────────────────────────
  clearAll: async () => {
    try {
      await clearAllChats()
      set({ chats: [], activeChatId: null, activeChat: null })
      toast.success('All chats cleared')
    } catch {
      toast.error('Failed to clear chats')
    }
  },
}))
