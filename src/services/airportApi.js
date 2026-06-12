import axios from 'axios'

// Proxy üzerinden API isteği (/api → backend)
const apiClient = axios.create({
	baseURL: '/api',
	timeout: 10000,
})

// MOCK AIRPORTS - Fallback for static deployments (like Vercel) where Node backend proxy is not running
const MOCK_AIRPORTS = [
	{ skyId: 'IST', entityId: '96123843', name: 'İstanbul Havalimanı', subtitle: 'İstanbul, Türkiye', iata: 'IST', city: 'İstanbul', country: 'Türkiye', type: 'AIRPORT', label: 'İstanbul Havalimanı (IST)' },
	{ skyId: 'SAW', entityId: '96123844', name: 'Sabiha Gökçen Havalimanı', subtitle: 'İstanbul, Türkiye', iata: 'SAW', city: 'İstanbul', country: 'Türkiye', type: 'AIRPORT', label: 'Sabiha Gökçen Havalimanı (SAW)' },
	{ skyId: 'ESB', entityId: '96123845', name: 'Esenboğa Havalimanı', subtitle: 'Ankara, Türkiye', iata: 'ESB', city: 'Ankara', country: 'Türkiye', type: 'AIRPORT', label: 'Esenboğa Havalimanı (ESB)' },
	{ skyId: 'ADB', entityId: '96123846', name: 'Adnan Menderes Havalimanı', subtitle: 'İzmir, Türkiye', iata: 'ADB', city: 'İzmir', country: 'Türkiye', type: 'AIRPORT', label: 'Adnan Menderes Havalimanı (ADB)' },
	{ skyId: 'AYT', entityId: '96123847', name: 'Antalya Havalimanı', subtitle: 'Antalya, Türkiye', iata: 'AYT', city: 'Antalya', country: 'Türkiye', type: 'AIRPORT', label: 'Antalya Havalimanı (AYT)' },
	{ skyId: 'JFK', entityId: '96123848', name: 'John F. Kennedy Intl Airport', subtitle: 'New York, USA', iata: 'JFK', city: 'New York', country: 'USA', type: 'AIRPORT', label: 'John F. Kennedy Intl Airport (JFK)' },
	{ skyId: 'LHR', entityId: '96123849', name: 'Heathrow Airport', subtitle: 'London, United Kingdom', iata: 'LHR', city: 'London', country: 'United Kingdom', type: 'AIRPORT', label: 'Heathrow Airport (LHR)' },
	{ skyId: 'CDG', entityId: '96123850', name: 'Charles de Gaulle Airport', subtitle: 'Paris, France', iata: 'CDG', city: 'Paris', country: 'France', type: 'AIRPORT', label: 'Charles de Gaulle Airport (CDG)' },
]

/**
 * Airport autocomplete search — Sky Scrapper API (through Node proxy)
 * @param {string} query - Search query (min 2 chars)
 * @param {string} locale - Language code ('tr' or 'en')
 * @returns {Promise<Array>} Normalized airport list
 */
export async function searchAirports(query, locale = 'tr') {
	if (!query || query.length < 2) return []

	try {
		const response = await apiClient.get('/airports', {
			params: { query, locale },
		})
		return normalizeAirports(response.data)
	} catch (error) {
		console.warn('Airport search API failed, using local mock data fallback:', error.message)

		// Filter local mock airports by query
		const q = query.toLowerCase()
		const filtered = MOCK_AIRPORTS.filter(item =>
			item.name.toLowerCase().includes(q) ||
			item.iata.toLowerCase().includes(q) ||
			item.city.toLowerCase().includes(q)
		)

		// Map display-friendly labels based on locale
		return filtered.map(item => ({
			...item,
			name: locale === 'en' && item.skyId === 'IST' ? 'Istanbul Airport' : item.name,
			subtitle: locale === 'en' && item.skyId === 'IST' ? 'Istanbul, Turkey' : item.subtitle,
			label: item.iata ? `${item.name} (${item.iata})` : item.name,
		}))
	}
}

/**
 * Normalize the airport API response for frontend consumption
 */
function normalizeAirports(apiData) {
	const airports = apiData?.data || []

	return airports.map(item => ({
		skyId: item.skyId || '',
		entityId: item.entityId || '',
		name: item.name || '',
		subtitle: item.subtitle || '',
		iata: item.iata || item.skyId || '',
		city: item.city || '',
		country: item.country || '',
		type: item.type || 'AIRPORT',
		// Display-friendly label
		label: item.iata
			? `${item.name} (${item.iata})`
			: item.name,
	}))
}
