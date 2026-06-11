// ============================================
// ThemeContext.jsx — Dark Mode State Management
// Stores user preference in localStorage
// ============================================
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

// Get initial theme from localStorage or system preference
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('aerotrack_theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* silently ignore localStorage errors */ }

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply theme class to document and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('aerotrack_theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.')
  }
  return context
}
