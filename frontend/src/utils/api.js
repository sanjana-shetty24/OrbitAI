import axios from 'axios'

const api = axios.create({
  baseURL: 'https://orbit-ai-api-flame.vercel.app',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Chat endpoints ────────────────────────────────────────────
export const createNewChat = (title = 'New Chat') =>
  api.post('/new-chat', { title }).then(r => r.data)

export const sendMessage = (chat_id, message) =>
  api.post('/chat', { chat_id, message }).then(r => r.data)

export const fetchHistory = () =>
  api.get('/history').then(r => r.data)

export const fetchChat = (chatId) =>
  api.get(`/chat/${chatId}`).then(r => r.data)

export const deleteChat = (chatId) =>
  api.delete(`/chat/${chatId}`).then(r => r.data)

export const renameChat = (chatId, title) =>
  api.patch(`/chat/${chatId}/rename`, { title }).then(r => r.data)

export const clearAllChats = () =>
  api.delete('/chats/all').then(r => r.data)

export default api