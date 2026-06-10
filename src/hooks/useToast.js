// ============================================
// useToast.js — Toast Bildirim Hook'u
// Öğrenci 3 sorumluluğu
// ============================================
import { useState, useCallback } from 'react'

let nextId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  // Yeni toast ekle — type: 'success' | 'error' | 'info' | 'warning'
  const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type, duration }])

    // Süre dolunca otomatik kaldır
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)

    return id
  }, [])

  // Manuel kaldır (kullanıcı çarpıya basarsa)
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Kısayol fonksiyonlar
  const toast = {
    success: (message, opts = {}) => addToast({ message, type: 'success', ...opts }),
    error:   (message, opts = {}) => addToast({ message, type: 'error',   ...opts }),
    info:    (message, opts = {}) => addToast({ message, type: 'info',    ...opts }),
    warning: (message, opts = {}) => addToast({ message, type: 'warning', ...opts }),
  }

  return { toasts, toast, removeToast }
}
