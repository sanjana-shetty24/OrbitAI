import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import WelcomeScreen from './WelcomeScreen'

export default function ChatArea({ onSendPrompt }) {
  const { activeChat, isTyping, isLoading, sendMessage } = useChatStore()
  const bottomRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChat?.messages, isTyping])

  const handleRegenerate = async () => {
    const msgs = activeChat?.messages
    if (!msgs?.length) return
    // Find last user message
    const lastUser = [...msgs].reverse().find(m => m.role === 'user')
    if (lastUser) await sendMessage(lastUser.content)
  }

  if (!activeChat) {
    return <WelcomeScreen onPrompt={onSendPrompt} />
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-zinc-600 text-sm">Loading conversation…</p>
        </div>
      </div>
    )
  }

  const messages = activeChat.messages || []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-4 pb-2">
        {messages.length === 0 && (
          <WelcomeScreen onPrompt={onSendPrompt} />
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <Message
              key={msg.id || i}
              msg={msg}
              onRegenerate={i === messages.length - 1 && msg.role === 'assistant' ? handleRegenerate : undefined}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
