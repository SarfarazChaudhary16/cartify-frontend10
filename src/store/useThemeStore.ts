import { create } from 'zustand'
type Theme = 'light' | 'dark'
interface ThemeState { theme: Theme; toggleTheme: () => void; setTheme: (theme: Theme) => void }
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('cartify-theme') as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.localStorage.setItem('cartify-theme', theme)
}
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => { const next = get().theme === 'dark' ? 'light' : 'dark'; applyThemeClass(next); set({ theme: next }) },
  setTheme: (theme) => { applyThemeClass(theme); set({ theme }) },
}))
if (typeof window !== 'undefined') applyThemeClass(getInitialTheme())
