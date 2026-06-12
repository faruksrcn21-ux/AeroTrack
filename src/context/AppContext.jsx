// ============================================
// AppContext.jsx — Global State Management
// Flights, tracking, toast, bookings, price alerts,
// and live flight status simulation
// ============================================
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useToast } from '../hooks/useToast'
import { useLanguage } from './LanguageContext'
import { useCurrency } from './CurrencyContext'
import { convertCurrency } from '../utils/validators'

const AppContext = createContext(null)

// ── Flight status list (for simulation) ──
const FLIGHT_STATUSES = [
  { key: 'scheduled', label: 'Scheduled', color: '#888' },
  { key: 'checkin',   label: 'Check-in Open', color: '#3b82f6' },
  { key: 'boarding',  label: 'Boarding', color: '#f59e0b' },
  { key: 'departed',  label: 'Departed', color: '#10b981' },
  { key: 'delayed',   label: 'Delayed', color: '#ef4444' },
  { key: 'landed',    label: 'Landed', color: '#6366f1' },
]

export function AppProvider({ children }) {
  const { t, lang } = useLanguage()
  const { currency } = useCurrency()
  // Search results state
  const [flights, setFlights] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Toast notification system
  const { toasts, toast, removeToast } = useToast()

  // ── Tracked flights: initialize from localStorage ──
  const [trackedFlights, setTrackedFlights] = useState(() => {
    try {
      const saved = localStorage.getItem('aerotrack_tracked')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ── Bookings: initialize from localStorage ──
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('aerotrack_bookings')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist tracked flights to localStorage on change
  useEffect(() => {
    localStorage.setItem('aerotrack_tracked', JSON.stringify(trackedFlights))
  }, [trackedFlights])

  // Persist bookings to localStorage on change
  useEffect(() => {
    localStorage.setItem('aerotrack_bookings', JSON.stringify(bookings))
  }, [bookings])

  // ── Add flight to tracking (with duplicate check) ──
  function addTracked(flight) {
    setTrackedFlights(prev => {
      const alreadyTracked = prev.some(f => f.id === flight.id)
      if (alreadyTracked) {
        toast.warning(`${flight.airline} ${flight.flightNumber} is already tracked!`)
        return prev
      }
      toast.success(`✈ ${flight.airline} ${flight.flightNumber} added to tracking`)
      return [...prev, {
        ...flight,
        trackedAt: new Date().toISOString(),
        originalPrice: flight.price,
        status: 'scheduled',
        gate: null,
      }]
    })
  }

  // ── Remove flight from tracking ──
  function removeTracked(flightId) {
    setTrackedFlights(prev => {
      const flight = prev.find(f => f.id === flightId)
      if (flight) {
        toast.info(`${flight.airline} ${flight.flightNumber} removed from tracking`)
      }
      return prev.filter(f => f.id !== flightId)
    })
  }

  // ── Check if a flight is being tracked ──
  function isTracked(flightId) {
    return trackedFlights.some(f => f.id === flightId)
  }

  // ══════════════════════════════════════════
  // PRICE ALERT SIMULATION
  // Periodically changes prices of tracked flights
  // ══════════════════════════════════════════
  const priceTimerRef = useRef(null)

  useEffect(() => {
    if (trackedFlights.length === 0) return

    priceTimerRef.current = setInterval(() => {
      setTrackedFlights(prev => {
        if (prev.length === 0) return prev

        // Randomly pick a tracked flight and change its price
        const randomIndex = Math.floor(Math.random() * prev.length)
        const flight = prev[randomIndex]
        const changePercent = (Math.random() * 20 - 10) / 100 // -10% to +10%
        const newPrice = Math.round(flight.price * (1 + changePercent))

        if (newPrice === flight.price) return prev

        const diff = newPrice - flight.price
        const displayDiff = currency === 'TRY' ? Math.abs(diff) : convertCurrency(Math.abs(diff), currency)
        const symbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€'

        if (diff < 0) {
          toast.success(`📉 ${flight.airline} ${flight.flightNumber} ${t('priceDropped')} (-${symbol}${displayDiff})`)
        } else {
          toast.warning(`📈 ${flight.airline} ${flight.flightNumber} ${t('priceIncreased')} (+${symbol}${displayDiff})`)
        }

        const updated = [...prev]
        updated[randomIndex] = {
          ...flight,
          previousPrice: flight.price,
          price: newPrice,
          priceChange: diff,
        }
        return updated
      })
    }, 30000) // Price change every 30 seconds

    return () => clearInterval(priceTimerRef.current)
  }, [trackedFlights.length, toast, currency, t])

  // ══════════════════════════════════════════
  // LIVE FLIGHT STATUS SIMULATION
  // Tracked flights progress through status stages
  // ══════════════════════════════════════════
  const statusTimerRef = useRef(null)

  useEffect(() => {
    if (trackedFlights.length === 0) return

    statusTimerRef.current = setInterval(() => {
      setTrackedFlights(prev => {
        if (prev.length === 0) return prev

        const randomIndex = Math.floor(Math.random() * prev.length)
        const flight = prev[randomIndex]

        // Find current status index and advance to the next
        const currentIdx = FLIGHT_STATUSES.findIndex(s => s.key === flight.status)
        const nextIdx = currentIdx + 1

        // If already at the last status, do nothing
        if (nextIdx >= FLIGHT_STATUSES.length) return prev

        const nextStatus = FLIGHT_STATUSES[nextIdx]

        // Assign a random gate number at boarding stage
        const gate = nextStatus.key === 'boarding'
          ? `${Math.floor(Math.random() * 30 + 1)}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`
          : flight.gate

        // Toast notifications for status changes
        if (nextStatus.key === 'boarding') {
          toast.info(`🚪 ${flight.airline} ${flight.flightNumber} — ${t('statusBoarding')}! ${t('statusGate')}: ${gate}`)
        } else if (nextStatus.key === 'delayed') {
          toast.warning(`⏱ ${flight.airline} ${flight.flightNumber} — ${t('statusDelayed')}!`)
        } else if (nextStatus.key === 'departed') {
          toast.success(`✈ ${flight.airline} ${flight.flightNumber} — ${t('statusDeparted')}!`)
        } else if (nextStatus.key === 'landed') {
          toast.success(`🛬 ${flight.airline} ${flight.flightNumber} — ${t('statusLanded')}!`)
        }

        const updated = [...prev]
        updated[randomIndex] = {
          ...flight,
          status: nextStatus.key,
          gate,
        }
        return updated
      })
    }, 45000) // Status update every 45 seconds

    return () => clearInterval(statusTimerRef.current)
  }, [trackedFlights.length, toast])

  // ══════════════════════════════════════════
  // BOOKING (TICKET PURCHASE)
  // ══════════════════════════════════════════

  function addBooking(bookingData) {
    const newBooking = {
      id: `booking-${Date.now()}`,
      ...bookingData,
      purchasedAt: new Date().toISOString(),
      status: 'confirmed',
      boardingPass: {
        gate: `${Math.floor(Math.random() * 30 + 1)}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
        boardingGroup: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        sequence: Math.floor(Math.random() * 150 + 1),
      },
    }

    setBookings(prev => [newBooking, ...prev])
    toast.success('🎟 Your ticket has been purchased successfully!')
    return newBooking
  }

  function cancelBooking(bookingId) {
    setBookings(prev => {
      const booking = prev.find(b => b.id === bookingId)
      if (booking) {
        toast.info(`🎟 ${booking.flight?.airline || ''} booking cancelled.`)
      }
      return prev.filter(b => b.id !== bookingId)
    })
  }

  const value = {
    // Search
    flights,
    setFlights,
    isLoading,
    setIsLoading,
    error,
    setError,
    hasSearched,
    setHasSearched,
    // Tracking
    trackedFlights,
    addTracked,
    removeTracked,
    isTracked,
    // Bookings
    bookings,
    addBooking,
    cancelBooking,
    // Toast
    toast,
    toasts,
    removeToast,
    // Status constants
    FLIGHT_STATUSES,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider.')
  }
  return context
}
