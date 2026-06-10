// ============================================
// AppContext.jsx — Global State Management
// Öğrenci 3 sorumluluğu
// ============================================
import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '../hooks/useToast'

// Context oluştur
const AppContext = createContext(null)

// Provider bileşeni — tüm uygulamayı sarar (main.jsx'te kullanılır)
export function AppProvider({ children }) {
  // Arama sonuçları state'i
  const [flights, setFlights] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Toast sistemi — Öğrenci 3
  const { toasts, toast, removeToast } = useToast()

  // Takip edilenler: localStorage'dan başlangıç değeri al
  const [trackedFlights, setTrackedFlights] = useState(() => {
    try {
      const saved = localStorage.getItem('aerotrack_tracked')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Takip listesi her değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('aerotrack_tracked', JSON.stringify(trackedFlights))
  }, [trackedFlights])

  // Uçuş takibe ekle (duplicate kontrolü ile)
  function addTracked(flight) {
    setTrackedFlights(prev => {
      const alreadyTracked = prev.some(f => f.id === flight.id)
      if (alreadyTracked) {
        toast.warning(`${flight.airline} ${flight.flightNumber} zaten takipte!`)
        return prev
      }
      toast.success(`✈ ${flight.airline} ${flight.flightNumber} takibe alındı`)
      return [...prev, { ...flight, trackedAt: new Date().toISOString() }]
    })
  }

  // Uçuşu takipten çıkar
  function removeTracked(flightId) {
    setTrackedFlights(prev => {
      const flight = prev.find(f => f.id === flightId)
      if (flight) {
        toast.info(`${flight.airline} ${flight.flightNumber} takipten çıkarıldı`)
      }
      return prev.filter(f => f.id !== flightId)
    })
  }

  // Takip edilip edilmediğini kontrol et
  function isTracked(flightId) {
    return trackedFlights.some(f => f.id === flightId)
  }

  const value = {
    flights,
    setFlights,
    isLoading,
    setIsLoading,
    error,
    setError,
    hasSearched,
    setHasSearched,
    trackedFlights,
    addTracked,
    removeTracked,
    isTracked,
    // Toast — isteğe bağlı olarak başka componentler de kullanabilir
    toast,
    toasts,
    removeToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook — context'e kolay erişim için
export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext, AppProvider içinde kullanılmalıdır.')
  }
  return context
}
