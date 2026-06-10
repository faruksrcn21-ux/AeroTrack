import axios from 'axios'

// Send the request through a proxy (using the proxy settings in vite.config.js)
const apiClient = axios.create({
	baseURL: '/api',
	timeout: 10000,
})

/**
 * Flight search — Sky Scrapper API (through Node proxy)
 * @param {Object} params - { origin, destination, date }
 * @returns {Promise<Array>} Normalized flight list
 */
export async function searchFlights({ origin, destination, date }) {
	const response = await apiClient.get('/flights/search', {
		params: { origin, destination, date },
	})
	return normalizeFlights(response.data)
}

/**
 * Normalize the API response — components expect a consistent format.
 * Customize according to the actual response structure of the Sky Scrapper API.
 */
function normalizeFlights(apiData) {
	// Sky Scrapper itineraries format
	const itineraries = apiData?.data?.itineraries || apiData?.itineraries || []

	return itineraries.map((item, index) => {
		const leg = item.legs?.[0] || {}
		const carrier = leg.carriers?.marketing?.[0] || {}
		const price = item.price?.raw || item.price?.formatted || 0

		return {
			id: item.id || `flight-${index}`,
			airline: carrier.name || 'Unknown',
			airlineLogo: carrier.logoUrl || null,
			flightNumber: `${carrier.alternateId || 'XX'}${index + 100}`,
			origin: leg.origin?.displayCode || leg.origin?.name || '???',
			originCity: leg.origin?.city || '',
			destination:
				leg.destination?.displayCode || leg.destination?.name || '???',
			destinationCity: leg.destination?.city || '',
			departureTime: leg.departure || '',
			arrivalTime: leg.arrival || '',
			durationMinutes: leg.durationInMinutes || 0,
			stops: leg.stopCount || 0,
			price:
				typeof price === 'number'
					? price
					: parseFloat(String(price).replace(/[^0-9.]/g, '')),
			currency: 'TRY',
			rawData: item, // For debugging
		}
	})
}

// -------- MOCK DATA (for testing when no API key is available) --------
export const MOCK_FLIGHTS = [
	{
		id: 'mock-1',
		airline: 'Turkish Airlines',
		airlineLogo: null,
		flightNumber: 'TK2024',
		origin: 'IST',
		originCity: 'Istanbul',
		destination: 'ADB',
		destinationCity: 'Izmir',
		departureTime: '2025-06-15T08:30:00',
		arrivalTime: '2025-06-15T09:45:00',
		durationMinutes: 75,
		stops: 0,
		price: 1850,
		currency: 'TRY',
	},
	{
		id: 'mock-2',
		airline: 'Pegasus',
		airlineLogo: null,
		flightNumber: 'PC307',
		origin: 'IST',
		originCity: 'Istanbul',
		destination: 'ADB',
		destinationCity: 'Izmir',
		departureTime: '2025-06-15T12:00:00',
		arrivalTime: '2025-06-15T13:20:00',
		durationMinutes: 80,
		stops: 0,
		price: 1250,
		currency: 'TRY',
	},
	{
		id: 'mock-3',
		airline: 'AnadoluJet',
		airlineLogo: null,
		flightNumber: 'TK7760',
		origin: 'IST',
		originCity: 'Istanbul',
		destination: 'ADB',
		destinationCity: 'Izmir',
		departureTime: '2025-06-15T17:45:00',
		arrivalTime: '2025-06-15T19:10:00',
		durationMinutes: 85,
		stops: 0,
		price: 980,
		currency: 'TRY',
	},
	{
		id: 'mock-4',
		airline: 'SunExpress',
		airlineLogo: null,
		flightNumber: 'XQ514',
		origin: 'IST',
		originCity: 'Istanbul',
		destination: 'ADB',
		destinationCity: 'Izmir',
		departureTime: '2025-06-15T21:30:00',
		arrivalTime: '2025-06-15T22:55:00',
		durationMinutes: 85,
		stops: 0,
		price: 1100,
		currency: 'TRY',
	},
]
