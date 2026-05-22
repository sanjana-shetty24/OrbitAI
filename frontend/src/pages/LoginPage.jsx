import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)

  const [form, setForm]   = useState({ email: '', password: '', remember: false })
  const [show, setShow]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Fill in all fields')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900)) // Simulate auth
    login({ email: form.email, name: form.email.split('@')[0] })
    toast.success('Welcome back!')
    navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-dvh animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-white font-display font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">Aether</span>
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-white">Welcome back</h1>
          <p className="text-zinc-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
                <input
                  name="email" type="email" value={form.email} onChange={handle}
                  placeholder="you@example.com"
                  className="input-ring w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:border-brand-500/60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
                <input
                  name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="••••••••"
                  className="input-ring w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:border-brand-500/60"
                />
                <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handle}
                className="w-4 h-4 rounded border-zinc-600 bg-white/5 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0" />
              <span className="text-sm text-zinc-400">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit" whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-600/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign in'}
            </motion.button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
