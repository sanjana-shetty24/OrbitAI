import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)

  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow]   = useState({ pw: false, confirm: false })
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) return toast.error('Fill in all fields')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login({ email: form.email, name: form.name })
    toast.success('Account created! Welcome to Aether.')
    navigate('/')
    setLoading(false)
  }

  const Field = ({ icon: Icon, name, type, placeholder, toggleKey }) => (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
      <input
        name={name} type={toggleKey ? (show[toggleKey] ? 'text' : 'password') : type}
        value={form[name]} onChange={handle} placeholder={placeholder}
        className="input-ring w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:border-brand-500/60"
      />
      {toggleKey && (
        <button type="button" onClick={() => setShow(s => ({ ...s, [toggleKey]: !s[toggleKey] }))}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
          {show[toggleKey] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-dvh animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-white font-display font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">Aether</span>
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-white">Create your account</h1>
          <p className="text-zinc-400 text-sm mt-1">Start building intelligent conversations</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Full Name</label>
              <Field icon={FiUser} name="name" type="text" placeholder="Your name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
              <Field icon={FiMail} name="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
              <Field icon={FiLock} name="password" placeholder="Min. 6 characters" toggleKey="pw" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Confirm Password</label>
              <Field icon={FiLock} name="confirm" placeholder="Repeat password" toggleKey="confirm" />
            </div>

            <motion.button type="submit" whileTap={{ scale: 0.98 }} disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-600/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</>
              ) : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
