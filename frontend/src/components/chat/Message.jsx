import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { FiCopy, FiCheck, FiThumbsUp, FiThumbsDown, FiRefreshCw } from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

function CodeBlock({ children, className, ...props }) {
  const [copied, setCopied] = useState(false)
  const lang = className?.replace('language-', '') || 'code'
  const code = String(children).trim()

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-white/10">
      {/* Code header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border-b border-white/10">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{lang}</span>
        <button onClick={copy}
          className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
          {copied ? <FiCheck size={11} className="text-green-400" /> : <FiCopy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto">
        <code className={className} {...props}>{children}</code>
      </pre>
    </div>
  )
}

export default function Message({ msg, onRegenerate }) {
  const isUser = msg.role === 'user'
  const [liked, setLiked]     = useState(null)   // 'up' | 'down' | null
  const [copied, setCopied]   = useState(false)

  const copyMsg = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const ts = msg.timestamp ? format(new Date(msg.timestamp), 'h:mm a') : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 px-4 py-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500
                        flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
          U
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-800
                        flex items-center justify-center text-white font-display font-bold text-xs shrink-0 mt-0.5
                        ring-2 ring-brand-500/20">
          A
        </div>
      )}

      {/* Bubble */}
      <div className={`flex flex-col max-w-[80%] lg:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {isUser ? (
          /* User bubble */
          <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-brand-600 text-white text-sm leading-relaxed shadow-md">
            {msg.content}
          </div>
        ) : (
          /* AI bubble */
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/[0.07]
                          shadow-sm w-full">
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code: ({ node, inline, className, children, ...props }) =>
                    inline
                      ? <code className={className} {...props}>{children}</code>
                      : <CodeBlock className={className} {...props}>{children}</CodeBlock>
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Meta row */}
        <div className={`flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-zinc-600">{ts}</span>

          {!isUser && (
            <div className="flex items-center gap-1">
              <button onClick={copyMsg}
                className="p-1 rounded text-zinc-600 hover:text-zinc-400 hover:bg-white/5 transition-all">
                {copied ? <FiCheck size={11} className="text-green-400" /> : <FiCopy size={11} />}
              </button>
              <button onClick={() => onRegenerate?.()}
                className="p-1 rounded text-zinc-600 hover:text-zinc-400 hover:bg-white/5 transition-all" title="Regenerate">
                <FiRefreshCw size={11} />
              </button>
              <button onClick={() => setLiked(liked === 'up' ? null : 'up')}
                className={`p-1 rounded transition-all hover:bg-white/5 ${liked === 'up' ? 'text-green-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                <FiThumbsUp size={11} />
              </button>
              <button onClick={() => setLiked(liked === 'down' ? null : 'down')}
                className={`p-1 rounded transition-all hover:bg-white/5 ${liked === 'down' ? 'text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
                <FiThumbsDown size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
