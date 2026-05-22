import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useChatStore } from '../store/chatStore'
import { useThemeStore } from '../store/themeStore'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import ChatArea from '../components/chat/ChatArea'
import ChatInput from '../components/chat/ChatInput'
import SettingsModal from '../components/ui/SettingsModal'

export default function ChatPage() {
  const { activeChat, activeChatId, sendMessage, newChat, isTyping, loadHistory } = useChatStore()
  const { isDark } = useThemeStore()
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => { loadHistory() }, [])

  const handleSend = async (text) => {
    let chatId = activeChatId
    // Auto-create chat if none is active
    if (!chatId) {
      const chat = await newChat()
      chatId = chat?.id
      if (!chatId) return
    }
    await sendMessage(text)
  }

  const handlePrompt = async (promptText) => {
    await handleSend(promptText)
  }

  return (
    <div className={`flex h-dvh overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-surface-950 dark:bg-surface-950 bg-zinc-50" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40
                        bg-brand-600/5 rounded-full blur-3xl" />
      </div>

      {/* Layout */}
      <div className="relative flex w-full h-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <motion.div
          layout
          className="flex flex-col flex-1 min-w-0 h-full relative"
        >
          {/* Navbar */}
          <Navbar onSettings={() => setShowSettings(true)} />

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ChatArea onSendPrompt={handlePrompt} />
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </div>
        </motion.div>
      </div>

      {/* Settings modal */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
