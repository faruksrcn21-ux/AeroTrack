import axios from 'axios'

// Send the request through a proxy (using the proxy settings in vite.config.js)
const apiClient = axios.create({
	baseURL: '/api',
	timeout: 10000,
})

/**
 * Flight search — Sky Scrapper API (through Node proxy)
 * Supports round-trip, passengers, cabin class, locale and currency.
 *
 * @param {Object} params - Search parameters
 * @param {string} params.origin       - Origin city/airport
 * @param {string} params.destination  - Destination city/airport
 * @param {string} params.date         - Departure date (YYYY-MM-DD)
 * @param {string} [params.returnDate] - Return date (YYYY-MM-DD, optional for round-trip)
 * @param {number} [params.adults=1]   - Number of adult passengers
 * @param {number} [params.children=0] - Number of child passengers
 * @param {number} [params.infants=0]  - Number of infant passengers
 * @param {string} [params.cabinClass='economy'] - Cabin class
 * @param {string} [params.locale='tr']    - Language code ('tr' or 'en')
 * @param {string} [params.currency='TRY'] - Currency code ('TRY', 'USD', 'EUR')
 * @returns {Promise<Array>} Normalized flight list
 */
export async function searchFlights({
	origin,
	destination,
	date,
	returnDate,
	adults = 1,
	children = 0,
	infants = 0,
	cabinClass = 'economy',
	locale = 'tr',
	currency = 'TRY',
}) {
	const params = {
		origin,
		destination,
		date,
		adults: String(adults),
		children: String(children),
		infants: String(infants),
		cabinClass,
		locale,
		currency,
	}

	// Add returnDate only if provided (round-trip)
	if (returnDate) {
		params.returnDate = returnDate
	}

	const response = await apiClient.get('/flights/search', { params })
	return normalizeFlights(response.data, currency)
}

/**
 * Normalize the API response — components expect a consistent format.
 * Customize according to the actual response structure of the Sky Scrapper API.
 */
function normalizeFlights(apiData, currency = 'TRY') {
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
			currency,
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
