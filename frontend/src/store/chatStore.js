import { create } from "zustand";
import {
  createNewChat,
  sendMessage,
  fetchHistory,
  fetchChat,
  deleteChat,
  renameChat,
  clearAllChats,
} from "../utils/api";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  // ─────────────────────────────
  // State
  // ─────────────────────────────
  chats: [],
  activeChatId: null,
  activeChat: null,
  isLoading: false,
  isTyping: false,
  sidebarOpen: true,

  // ─────────────────────────────
  // Sidebar
  // ─────────────────────────────
  toggleSidebar: () =>
    set((s) => ({
      sidebarOpen: !s.sidebarOpen,
    })),

  setSidebar: (value) =>
    set({
      sidebarOpen: value,
    }),

  // ─────────────────────────────
  // Load History
  // ─────────────────────────────
  loadHistory: async () => {
    try {
      const chats = await fetchHistory();
      set({ chats });
    } catch (err) {
      console.error(err);
    }
  },

  // ─────────────────────────────
  // Create New Chat
  // ─────────────────────────────
  newChat: async () => {
    try {
      const chat = await createNewChat();

      set((state) => ({
        chats: [
          {
            ...chat,
            message_count: 0,
            preview: "",
          },
          ...state.chats,
        ],
        activeChatId: chat.id,
        activeChat: chat,
      }));

      return chat;
    } catch (err) {
      console.error(err);
      toast.error("Could not create chat");
    }
  },

  // ─────────────────────────────
  // Select Chat
  // ─────────────────────────────
  selectChat: async (chatId) => {
    if (chatId === get().activeChatId) return;

    set({
      activeChatId: chatId,
      isLoading: true,
    });

    try {
      const chat = await fetchChat(chatId);

      set({
        activeChat: chat,
        isLoading: false,
      });
    } catch (err) {
      console.error(err);

      set({
        isLoading: false,
      });

      toast.error("Failed to load chat");
    }
  },

  // ─────────────────────────────
  // Send Message
  // ─────────────────────────────
  sendMessage: async (text) => {
    const { activeChatId } = get();

    if (!activeChatId || !text.trim()) return;

    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      activeChat: {
        ...state.activeChat,
        messages: [
          ...(state.activeChat?.messages || []),
          tempUserMessage,
        ],
      },
      isTyping: true,
    }));

    try {
      const data = await sendMessage(activeChatId, text);

      // Build updated chat using current chat + latest messages
      const updatedChat = {
        ...get().activeChat,
        messages: data.messages,
      };

      set((state) => ({
        activeChat: updatedChat,
        isTyping: false,

        chats: state.chats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                preview: data.reply.slice(0, 80),
                message_count: data.messages.length,
              }
            : chat
        ),
      }));
    } catch (err) {
      console.error(err);

      set((state) => ({
        activeChat: {
          ...state.activeChat,
          messages: state.activeChat.messages.filter(
            (m) => m.id !== tempUserMessage.id
          ),
        },
        isTyping: false,
      }));

      toast.error("Failed to send message");
    }
  },

  // ─────────────────────────────
  // Delete Chat
  // ─────────────────────────────
  deleteChat: async (chatId) => {
    try {
      await deleteChat(chatId);

      set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        activeChatId:
          state.activeChatId === chatId
            ? null
            : state.activeChatId,
        activeChat:
          state.activeChatId === chatId
            ? null
            : state.activeChat,
      }));

      toast.success("Chat deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete chat");
    }
  },

  // ─────────────────────────────
  // Rename Chat
  // ─────────────────────────────
  renameChat: async (chatId, title) => {
    try {
      await renameChat(chatId, title);

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, title }
            : chat
        ),

        activeChat:
          state.activeChat?.id === chatId
            ? {
                ...state.activeChat,
                title,
              }
            : state.activeChat,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename chat");
    }
  },

  // ─────────────────────────────
  // Clear All Chats
  // ─────────────────────────────
  clearAll: async () => {
    try {
      await clearAllChats();

      set({
        chats: [],
        activeChatId: null,
        activeChat: null,
      });

      toast.success("All chats cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear chats");
    }
  },
}));