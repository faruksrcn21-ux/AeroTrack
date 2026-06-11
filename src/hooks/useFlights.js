import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { useCurrency } from '../context/CurrencyContext'
import { MOCK_FLIGHTS, searchFlights } from '../services/flightApi'

// Set to true to use mock data instead of the real API.
const USE_MOCK = true

export function useFlights() {
	const { setFlights, setIsLoading, setError, setHasSearched } = useAppContext()
	const { lang } = useLanguage()
	const { currency } = useCurrency()

	const fetchFlights = useCallback(
		async searchParams => {
			setIsLoading(true)
			setError(null)
			setHasSearched(true)

			try {
				let results

				if (USE_MOCK) {
					// Realistic delay simulation
					await new Promise(resolve => setTimeout(resolve, 1200))
					results = MOCK_FLIGHTS
				} else {
					// Inject locale and currency from context into search params
					results = await searchFlights({
						...searchParams,
						locale: lang,
						currency,
					})
				}

				setFlights(results)
			} catch (err) {
				console.error('Flight search error:', err)

				if (err.response?.status === 429) {
					setError('API request limit exceeded. Please wait a bit.')
				} else if (err.response?.status === 401) {
					setError('Invalid API key. Please check your .env file.')
				} else if (err.code === 'ECONNABORTED') {
					setError('The request timed out. Check your internet connection.')
				} else {
					setError('An error occurred while loading flights. Please try again.')
				}

				setFlights([])
			} finally {
				setIsLoading(false)
			}
		},
		[setFlights, setIsLoading, setError, setHasSearched, lang, currency],
	)

	return { fetchFlights }
}
