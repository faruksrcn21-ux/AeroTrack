// ============================================
// useSearchHistory.js — Search History Hook
// Stores the last 5 searches in localStorage
// ============================================
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'aerotrack_history'
const MAX_ITEMS   = 5

// Safe read from localStorage
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

  // Save new search — removes duplicate routes, prepends to list
  const saveSearch = useCallback((formData) => {
    setHistory(prev => {
      // Remove existing entry with same origin + destination
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

      // Keep at most MAX_ITEMS
      const updated = [newEntry, ...filtered].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Remove single entry
  const removeSearch = useCallback((id) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  return { history, saveSearch, removeSearch, clearHistory }
}
