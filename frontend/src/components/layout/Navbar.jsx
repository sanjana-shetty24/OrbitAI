import { motion } from 'framer-motion'
import { FiMenu, FiSun, FiMoon, FiSettings } from 'react-icons/fi'
import { useChatStore } from '../../store/chatStore'
import { useThemeStore } from '../../store/themeStore'
import { useAuthStore } from '../../store/authStore'

export default function Navbar({ onSettings }) {
  const { toggleSidebar, activeChat, sidebarOpen } = useChatStore()
  const { isDark, toggle } = useThemeStore()
  const { user } = useAuthStore()

  return (
    <header className="h-14 border-b border-white/[0.06] dark:bg-surface-900/80 bg-white/80
                       backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/10
                     dark:hover:bg-white/10 transition-all shrink-0"
        >
          <FiMenu size={16} />
        </motion.button>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-zinc-200 dark:text-zinc-200 truncate">
            {activeChat?.title || 'Aether AI'}
          </h1>
          {activeChat && (
            <p className="text-[10px] text-zinc-500 dark:text-zinc-500">
              Powered by Gemini 2.5 Flash
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
          </motion.div>
        </motion.button>

        {/* Settings */}
        <button
          onClick={onSettings}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all"
        >
          <FiSettings size={15} />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500
                        flex items-center justify-center text-white text-xs font-bold ml-1 cursor-pointer
                        ring-2 ring-brand-500/30 hover:ring-brand-400/50 transition-all">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
