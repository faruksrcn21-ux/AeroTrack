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

					// Helper to parse "City Name (IATA)"
					const parseAirport = (text) => {
						if (!text) return { code: '???', city: '' }
						const match = text.match(/^(.*?)\s*\((.*?)\)$/)
						if (match) {
							return { city: match[1].trim(), code: match[2].trim() }
						}
						return { city: text, code: text.slice(0, 3).toUpperCase() }
					}

					const orig = parseAirport(searchParams.origin)
					const dest = parseAirport(searchParams.destination)
					const searchDate = searchParams.date || new Date().toISOString().split('T')[0]

					// Map the mock flights dynamically to match search inputs
					results = MOCK_FLIGHTS.map(f => {
						const depTime = f.departureTime.split('T')[1] || '08:00:00'
						const arrTime = f.arrivalTime.split('T')[1] || '09:30:00'
						return {
							...f,
							origin: orig.code,
							originCity: orig.city,
							destination: dest.code,
							destinationCity: dest.city,
							departureTime: `${searchDate}T${depTime}`,
							arrivalTime: `${searchDate}T${arrTime}`,
						}
					})
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
