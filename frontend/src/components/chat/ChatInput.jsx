import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiMic, FiPaperclip } from 'react-icons/fi'

const MAX_CHARS = 4000

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [text])

  const submit = () => {
    const msg = text.trim()
    if (!msg || disabled) return
    onSend(msg)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const charCount = text.length
  const nearLimit = charCount > MAX_CHARS * 0.85
  const atLimit   = charCount >= MAX_CHARS

  return (
    <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] bg-surface-900/80 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto">
        <motion.div
          animate={{ boxShadow: disabled ? 'none' : '0 0 0 1px rgba(59,130,246,0.2)' }}
          className="relative flex items-end gap-2 p-3 rounded-2xl
                     bg-white/[0.05] border border-white/[0.09]
                     focus-within:border-brand-500/40 focus-within:bg-white/[0.07]
                     transition-all duration-200"
        >
          {/* File upload */}
          <button
            className="p-1.5 text-zinc-600 hover:text-zinc-400 hover:bg-white/10 rounded-lg transition-all self-end mb-0.5"
            title="Attach file (coming soon)"
          >
            <FiPaperclip size={15} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => { if (e.target.value.length <= MAX_CHARS) setText(e.target.value) }}
            onKeyDown={handleKey}
            disabled={disabled}
            placeholder="Message Aether…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600
                       resize-none outline-none leading-relaxed py-1
                       disabled:opacity-50 disabled:cursor-not-allowed
                       min-h-[28px] max-h-[160px] overflow-y-auto"
          />

          {/* Right side */}
          <div className="flex items-end gap-1 self-end mb-0.5">
            {/* Char counter */}
            <AnimatePresence>
              {nearLimit && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`text-[10px] font-mono mr-1 ${atLimit ? 'text-red-400' : 'text-zinc-500'}`}
                >
                  {charCount}/{MAX_CHARS}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Voice btn */}
            <button
              className="p-1.5 text-zinc-600 hover:text-zinc-400 hover:bg-white/10 rounded-lg transition-all"
              title="Voice input (coming soon)"
            >
              <FiMic size={15} />
            </button>

            {/* Send btn */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={submit}
              disabled={!text.trim() || disabled}
              className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-600
                         transition-all duration-150 shadow-md shadow-brand-600/20"
            >
              <FiSend size={13} />
            </motion.button>
          </div>
        </motion.div>

        <p className="text-center text-[10px] text-zinc-700 mt-2">
          Aether uses Gemini 2.5 Flash · Responses may be inaccurate
        </p>
      </div>
    </div>
  )
}
