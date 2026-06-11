// ============================================
// useFlightFilter.js — Flight Filtering & Sorting Hook
// Filters and sorts the flight list on the client side
// ============================================
import { useState, useMemo, useCallback } from 'react'

// Default filter values
const DEFAULT_FILTERS = {
  sortBy: 'best',         // 'cheapest' | 'fastest' | 'best'
  maxStops: null,          // null = all, 0 = direct, 1, 2
  maxPrice: null,          // null = no limit
  minPrice: null,          // null = no limit
  airlines: [],            // [] = all airlines
}

/**
 * Custom hook that filters and sorts a flight list.
 * @param {Array} flights — raw flight list (from context)
 * @returns {Object} — filteredFlights, filters, setters, meta info
 */
export function useFlightFilter(flights = []) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // ── Meta info: price bounds and airline list ──
  const meta = useMemo(() => {
    if (flights.length === 0) {
      return { minPrice: 0, maxPrice: 10000, airlines: [] }
    }

    const prices = flights.map(f => f.price)
    const airlineSet = new Set(flights.map(f => f.airline))

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      airlines: [...airlineSet].sort(),
    }
  }, [flights])

  // ── Sorting function ──
  function sortFlights(list, sortBy) {
    const sorted = [...list]

    switch (sortBy) {
      case 'cheapest':
        return sorted.sort((a, b) => a.price - b.price)

      case 'fastest':
        return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes)

      case 'best':
      default:
        // Normalize price and duration to calculate the best score
        return sorted.sort((a, b) => {
          const scoreA = a.price * 0.6 + a.durationMinutes * 10 * 0.4
          const scoreB = b.price * 0.6 + b.durationMinutes * 10 * 0.4
          return scoreA - scoreB
        })
    }
  }

  // ── Filtered and sorted list ──
  const filteredFlights = useMemo(() => {
    let result = [...flights]

    // Stop count filter
    if (filters.maxStops !== null) {
      result = result.filter(f => f.stops <= filters.maxStops)
    }

    // Price range filter
    if (filters.minPrice !== null) {
      result = result.filter(f => f.price >= filters.minPrice)
    }
    if (filters.maxPrice !== null) {
      result = result.filter(f => f.price <= filters.maxPrice)
    }

    // Airline filter
    if (filters.airlines.length > 0) {
      result = result.filter(f => filters.airlines.includes(f.airline))
    }

    // Apply sorting
    return sortFlights(result, filters.sortBy)
  }, [flights, filters])

  // ── Setter functions ──
  const setSortBy = useCallback((sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }, [])

  const setMaxStops = useCallback((maxStops) => {
    setFilters(prev => ({ ...prev, maxStops }))
  }, [])

  const setPriceRange = useCallback((minPrice, maxPrice) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice }))
  }, [])

  const toggleAirline = useCallback((airline) => {
    setFilters(prev => {
      const current = prev.airlines
      const updated = current.includes(airline)
        ? current.filter(a => a !== airline)
        : [...current, airline]
      return { ...prev, airlines: updated }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  return {
    filteredFlights,
    filters,
    meta,
    setSortBy,
    setMaxStops,
    setPriceRange,
    toggleAirline,
    resetFilters,
    activeFilterCount:
      (filters.maxStops !== null ? 1 : 0) +
      (filters.minPrice !== null ? 1 : 0) +
      (filters.maxPrice !== null ? 1 : 0) +
      (filters.airlines.length > 0 ? 1 : 0),
  }
}
