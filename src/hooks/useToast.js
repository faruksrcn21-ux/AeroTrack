// ============================================
// useToast.js — Toast Notification Hook
// ============================================
import { useState, useCallback } from 'react'

let nextId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  // Add a new toast — type: 'success' | 'error' | 'info' | 'warning'
  const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type, duration }])

    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)

    return id
  }, [])

  // Manually remove (when user clicks dismiss)
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Shortcut functions
  const toast = {
    success: (message, opts = {}) => addToast({ message, type: 'success', ...opts }),
    error:   (message, opts = {}) => addToast({ message, type: 'error',   ...opts }),
    info:    (message, opts = {}) => addToast({ message, type: 'info',    ...opts }),
    warning: (message, opts = {}) => addToast({ message, type: 'warning', ...opts }),
  }

  return { toasts, toast, removeToast }
}
