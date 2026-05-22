import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiSearch, FiTrash2, FiEdit3, FiCheck, FiX,
  FiSettings, FiLogOut, FiMessageSquare, FiChevronLeft
} from 'react-icons/fi'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
import { formatDistanceToNow } from 'date-fns'
import SettingsModal from '../ui/SettingsModal'

export default function Sidebar() {
  const {
    chats, activeChatId, sidebarOpen,
    newChat, selectChat, deleteChat, renameChat, loadHistory, setSidebar
  } = useChatStore()
  const { user, logout } = useAuthStore()

  const [search, setSearch]         = useState('')
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal]   = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [hoveredId, setHoveredId]   = useState(null)

  useEffect(() => { loadHistory() }, [])

  const filtered = chats.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const startRename = (chat, e) => {
    e.stopPropagation()
    setRenamingId(chat.id)
    setRenameVal(chat.title)
  }

  const commitRename = (id) => {
    if (renameVal.trim()) renameChat(id, renameVal.trim())
    setRenamingId(null)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    deleteChat(id)
  }

  const handleNew = async () => {
    const chat = await newChat()
    if (chat) selectChat(chat.id)
  }

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed md:relative z-30 top-0 left-0 h-full w-72 flex flex-col
                       bg-surface-900 border-r border-white/[0.06] shrink-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/30">
                  <span className="text-white font-display font-bold text-sm">A</span>
                </div>
                <span className="font-display font-bold text-white text-lg">Aether</span>
              </div>
              <button onClick={() => setSidebar(false)}
                className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
                <FiChevronLeft size={16} />
              </button>
            </div>

            {/* New Chat */}
            <div className="px-3 pt-3 pb-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNew}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                           bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30
                           text-brand-300 hover:text-brand-200 text-sm font-medium
                           transition-all duration-200 group"
              >
                <FiPlus size={15} className="group-hover:rotate-90 transition-transform duration-200" />
                New Chat
              </motion.button>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="w-full pl-8 pr-3 py-2 bg-white/[0.04] border border-white/[0.07]
                             rounded-lg text-xs text-zinc-300 placeholder-zinc-600
                             focus:outline-none focus:border-brand-500/40 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
              {filtered.length === 0 && (
                <div className="text-center py-10 text-zinc-600 text-xs">
                  {search ? 'No chats found' : 'No chats yet — start a new one!'}
                </div>
              )}
              <AnimatePresence initial={false}>
                {filtered.map(chat => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setHoveredId(chat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => selectChat(chat.id)}
                    className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer
                                transition-all duration-150 ${
                      activeChatId === chat.id
                        ? 'sidebar-item-active'
                        : 'hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FiMessageSquare size={13} className="shrink-0 opacity-60" />

                    <div className="flex-1 min-w-0">
                      {renamingId === chat.id ? (
                        <input
                          autoFocus
                          value={renameVal}
                          onChange={e => setRenameVal(e.target.value)}
                          onBlur={() => commitRename(chat.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitRename(chat.id)
                            if (e.key === 'Escape') setRenamingId(null)
                          }}
                          onClick={e => e.stopPropagation()}
                          className="w-full bg-white/10 rounded px-1.5 py-0.5 text-xs text-zinc-100 outline-none border border-brand-500/50"
                        />
                      ) : (
                        <>
                          <p className="text-xs font-medium truncate">{chat.title}</p>
                          <p className="text-[10px] text-zinc-600 truncate mt-0.5">
                            {chat.updated_at
                              ? formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true })
                              : ''}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Action buttons */}
                    {renamingId === chat.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); commitRename(chat.id) }}
                          className="p-1 rounded text-green-400 hover:bg-white/10"><FiCheck size={11} /></button>
                        <button onClick={e => { e.stopPropagation(); setRenamingId(null) }}
                          className="p-1 rounded text-red-400 hover:bg-white/10"><FiX size={11} /></button>
                      </div>
                    ) : hoveredId === chat.id || activeChatId === chat.id ? (
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button onClick={e => startRename(chat, e)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all">
                          <FiEdit3 size={11} />
                        </button>
                        <button onClick={e => handleDelete(chat.id, e)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <FiTrash2 size={11} />
                        </button>
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] p-3 space-y-1">
              <button onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-500
                           hover:text-zinc-300 hover:bg-white/[0.05] text-xs transition-all">
                <FiSettings size={13} /> Settings
              </button>
              <button onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-500
                           hover:text-red-400 hover:bg-red-500/10 text-xs transition-all">
                <FiLogOut size={13} /> Sign out
              </button>
              {/* User info */}
              <div className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-300 truncate">{user?.name}</p>
                  <p className="text-[10px] text-zinc-600 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebar(false)}
            className="md:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}
