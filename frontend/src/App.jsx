import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useThemeStore } from './store/themeStore'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  const { isDark } = useThemeStore()
  const { isAuthenticated } = useAuthStore()

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/*"
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
