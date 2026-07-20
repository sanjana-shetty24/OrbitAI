import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create a new chat
export const createNewChat = (title = 'New Chat') =>
  api.post('/new-chat', { title }).then((res) => res.data)

// Send a message
export const sendMessage = (chat_id, message) =>
  api.post('/chat', { chat_id, message }).then((res) => res.data)

// Get chat history
export const fetchHistory = () =>
  api.get('/history').then((res) => res.data)

// Get a single chat
export const fetchChat = (chatId) =>
  api.get(`/chat/${chatId}`).then((res) => res.data)

// Delete one chat
export const deleteChat = (chatId) =>
  api.delete(`/chat/${chatId}`).then((res) => res.data)

// Rename a chat
export const renameChat = (chatId, title) =>
  api.patch(`/chat/${chatId}/rename`, { title }).then((res) => res.data)

// Delete all chats
export const clearAllChats = () =>
  api.delete('/chats/all').then((res) => res.data)

export default api