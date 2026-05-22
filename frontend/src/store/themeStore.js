import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set(s => ({ isDark: !s.isDark })),
      setDark: (v) => set({ isDark: v }),
    }),
    { name: 'aether-theme' }
  )
)
