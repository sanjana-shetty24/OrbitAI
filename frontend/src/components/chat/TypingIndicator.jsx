import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 px-4 py-3"
    >
      {/* AI avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-800
                      flex items-center justify-center text-white font-display font-bold text-xs shrink-0 mt-0.5
                      ring-2 ring-brand-500/20">
        A
      </div>

      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/[0.07]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="typing-dot w-2 h-2 rounded-full bg-brand-400 block"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500 font-medium">Gemini is thinking…</span>
        </div>
      </div>
    </motion.div>
  )
}
