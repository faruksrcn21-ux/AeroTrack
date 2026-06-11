// ============================================
// CurrencyContext.jsx — Currency State Management
// Manages TRY / USD / EUR selection
// ============================================
import { createContext, useContext, useState, useCallback } from 'react'

const CurrencyContext = createContext(null)

const SUPPORTED_CURRENCIES = [
  { code: 'TRY', symbol: '₺', label: 'Türk Lirası' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
]

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('aerotrack_currency')
      if (['TRY', 'USD', 'EUR'].includes(saved)) return saved
    } catch { /* silently ignore */ }
    return 'TRY'
  })

  const setCurrency = useCallback((code) => {
    if (['TRY', 'USD', 'EUR'].includes(code)) {
      setCurrencyState(code)
      localStorage.setItem('aerotrack_currency', code)
    }
  }, [])

  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0]

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      currencyInfo,
      currencies: SUPPORTED_CURRENCIES,
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider.')
  }
  return context
}
