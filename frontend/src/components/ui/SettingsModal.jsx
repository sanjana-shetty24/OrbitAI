import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiX, FiSun, FiMoon, FiTrash2, FiDownload, FiUser,
  FiAlertTriangle
} from 'react-icons/fi'
import { useChatStore } from '../../store/chatStore'
import { useThemeStore } from '../../store/themeStore'
import { useAuthStore } from '../../store/authStore'
import { exportTXT, exportJSON, exportPDF } from '../../utils/export'
import toast from 'react-hot-toast'

export default function SettingsModal({ open, onClose }) {
  const { isDark, toggle, setDark } = useThemeStore()
  const { clearAll, activeChat }    = useChatStore()
  const { user }                    = useAuthStore()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = async () => {
    if (!confirmClear) { setConfirmClear(true); return }
    await clearAll()
    setConfirmClear(false)
    onClose()
  }

  const handleExport = async (type) => {
    if (!activeChat || !activeChat.messages?.length) {
      toast.error('Open a chat to export')
      return
    }
    try {
      if (type === 'txt')  await exportTXT(activeChat)
      if (type === 'json') await exportJSON(activeChat)
      if (type === 'pdf')  await exportPDF(activeChat)
      toast.success(`Exported as ${type.toUpperCase()}`)
    } catch {
      toast.error('Export failed')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md bg-surface-900 border border-white/10 rounded-2xl
                            shadow-2xl shadow-black/50 pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
                <h2 className="font-display font-bold text-white text-lg">Settings</h2>
                <button onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all">
                  <FiX size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile */}
                <section>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiUser size={11} /> Profile
                  </h3>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500
                                    flex items-center justify-center text-white font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
                      <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                </section>

                {/* Theme */}
                <section>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Appearance</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Dark', icon: FiMoon, value: true },
                      { label: 'Light', icon: FiSun, value: false },
                    ].map(t => (
                      <button key={t.label} onClick={() => setDark(t.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl text-sm border transition-all
                          ${isDark === t.value
                            ? 'bg-brand-600/20 border-brand-500/40 text-brand-300'
                            : 'bg-white/[0.04] border-white/[0.06] text-zinc-400 hover:bg-white/[0.07]'}`}>
                        <t.icon size={14} />
                        {t.label} Mode
                      </button>
                    ))}
                  </div>
                </section>

                {/* Export */}
                <section>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiDownload size={11} /> Export Current Chat
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['txt', 'json', 'pdf'].map(type => (
                      <button key={type} onClick={() => handleExport(type)}
                        className="p-2.5 rounded-xl text-xs font-medium uppercase tracking-wider
                                   bg-white/[0.04] border border-white/[0.06] text-zinc-400
                                   hover:bg-white/[0.08] hover:text-zinc-200 hover:border-white/10 transition-all">
                        {type}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Danger zone */}
                <section>
                  <h3 className="text-xs font-semibold text-red-500/80 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiAlertTriangle size={11} /> Danger Zone
                  </h3>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm
                                border transition-all ${
                      confirmClear
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 font-semibold'
                        : 'bg-white/[0.04] border-white/[0.06] text-zinc-500 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                    }`}
                  >
                    <FiTrash2 size={13} />
                    {confirmClear ? 'Click again to confirm — this cannot be undone!' : 'Clear all chats'}
                  </motion.button>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
