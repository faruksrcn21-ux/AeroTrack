// ============================================
// useDebounce.js — Debounce Hook
// Prevents excessive API calls during rapid input changes
// (e.g. autocomplete airport search)
// ============================================
import { useState, useEffect } from 'react'

/**
 * Returns a debounced version of the given value.
 * Only updates after the user stops typing for the specified delay.
 *
 * @param {any} value — the value to debounce
 * @param {number} delay — delay in ms, default 400ms
 * @returns {any} — debounced value
 *
 * Usage:
 *   const debouncedQuery = useDebounce(searchQuery, 400)
 *   useEffect(() => { fetchAirports(debouncedQuery) }, [debouncedQuery])
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
