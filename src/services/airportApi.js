import axios from 'axios'

// Proxy üzerinden API isteği (/api → backend)
const apiClient = axios.create({
	baseURL: '/api',
	timeout: 10000,
})

/**
 * Airport autocomplete search — Sky Scrapper API (through Node proxy)
 * @param {string} query - Search query (min 2 chars)
 * @param {string} locale - Language code ('tr' or 'en')
 * @returns {Promise<Array>} Normalized airport list
 */
export async function searchAirports(query, locale = 'tr') {
	if (!query || query.length < 2) return []

	const response = await apiClient.get('/airports', {
		params: { query, locale },
	})

	return normalizeAirports(response.data)
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
