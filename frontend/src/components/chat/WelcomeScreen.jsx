import { motion } from 'framer-motion'
import { FiCpu, FiCode, FiFileText, FiBriefcase, FiZap, FiGlobe } from 'react-icons/fi'

const SUGGESTIONS = [
  { icon: FiCpu,      label: 'Explain Machine Learning',  prompt: 'Explain machine learning to me like I\'m a beginner, with real-world examples.' },
  { icon: FiCode,     label: 'Write Python code',          prompt: 'Write a Python function that sorts a list of dictionaries by a specific key.' },
  { icon: FiFileText, label: 'Summarize my notes',         prompt: 'Help me summarize and organize my notes into clear bullet points.' },
  { icon: FiBriefcase,label: 'Interview preparation',      prompt: 'Help me prepare for a software engineering interview. What are the most common questions?' },
  { icon: FiZap,      label: 'Productivity hacks',         prompt: 'Give me 5 powerful productivity techniques backed by science.' },
  { icon: FiGlobe,    label: 'Explain a concept',          prompt: 'Explain how the internet works in simple terms.' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function WelcomeScreen({ onPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo + Greeting */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700
                        flex items-center justify-center mx-auto mb-4
                        shadow-2xl shadow-brand-500/30 ring-4 ring-brand-500/10">
          <span className="text-white font-display font-bold text-3xl">A</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Hello! I'm <span className="text-brand-400">Aether</span>
        </h2>
        <p className="text-zinc-500 text-base max-w-sm mx-auto leading-relaxed">
          Powered by Gemini 2.5 Flash. Ask me anything — I'm here to help.
        </p>
      </motion.div>

      {/* Suggestion cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl"
      >
        {SUGGESTIONS.map(s => (
          <motion.button
            key={s.label}
            variants={item}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPrompt(s.prompt)}
            className="group flex items-start gap-3 p-4 rounded-xl text-left
                       bg-white/[0.04] hover:bg-white/[0.08]
                       border border-white/[0.07] hover:border-brand-500/30
                       transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-brand-500/10 group-hover:bg-brand-500/20 transition-colors shrink-0">
              <s.icon size={14} className="text-brand-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
                {s.label}
              </p>
              <p className="text-xs text-zinc-600 group-hover:text-zinc-500 mt-0.5 line-clamp-2 transition-colors">
                {s.prompt}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-zinc-700 text-xs mt-10"
      >
        Press Enter to send · Shift+Enter for new line
      </motion.p>
    </div>
  )
}
