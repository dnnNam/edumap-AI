import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const THEME_STORAGE_KEY = 'edumap-theme'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  // Ưu tiên class đã được inline script trong index.html gán sẵn lên <html>
  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') {
    return saved
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeToDOM(theme: Theme, withTransition = true) {
  const root = document.documentElement

  if (withTransition) {
    root.classList.add('theme-transitioning')
  }

  if (theme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
    root.style.colorScheme = 'light'
  }

  // Phát event tùy chỉnh để Three.js hoặc các module phi React cập nhật theo
  window.dispatchEvent(new CustomEvent('edumap-theme-changed', { detail: { theme } }))

  if (withTransition) {
    window.setTimeout(() => {
      root.classList.remove('theme-transitioning')
    }, 320)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    // Đảm bảo DOM khớp với state ban đầu (không transition lúc đầu trang)
    applyThemeToDOM(theme, false)

    // Lắng nghe thay đổi theme hệ thống nếu người dùng chưa chọn thủ công
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const hasSavedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (!hasSavedTheme) {
        const newTheme: Theme = e.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        applyThemeToDOM(newTheme, true)
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // Bỏ qua lỗi trong môi trường sandbox/incognito hạn chế
    }
    applyThemeToDOM(newTheme, true)
  }

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const value: ThemeContextType = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

