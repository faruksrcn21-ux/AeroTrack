// ============================================
// useSearchHistory.js — Arama Geçmişi Hook'u
// Öğrenci 3 sorumluluğu
// Son 5 aramayı localStorage'da tutar
// ============================================
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'aerotrack_history'
const MAX_ITEMS   = 5

// localStorage'dan güvenli okuma
function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState(loadHistory)

  // Yeni arama kaydet — aynı rota zaten varsa önce çıkar, başa ekle
  const saveSearch = useCallback((formData) => {
    setHistory(prev => {
      // Aynı kalkış + varış kombinasyonu varsa çıkar (date farklı olabilir)
      const filtered = prev.filter(
        item => !(
          item.origin.toLowerCase()      === formData.origin.toLowerCase() &&
          item.destination.toLowerCase() === formData.destination.toLowerCase()
        )
      )

      const newEntry = {
        id:          Date.now(),
        origin:      formData.origin.trim(),
        destination: formData.destination.trim(),
        date:        formData.date,
        searchedAt:  new Date().toISOString(),
      }

      // En fazla MAX_ITEMS tut
      const updated = [newEntry, ...filtered].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Tekli sil
  const removeSearch = useCallback((id) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Tümünü temizle
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  return { history, saveSearch, removeSearch, clearHistory }
}
