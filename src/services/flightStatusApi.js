import axios from 'axios'

// Proxy üzerinden API isteği (/api → backend)
const apiClient = axios.create({
	baseURL: '/api',
	timeout: 10000,
})

/**
 * Get price history for a flight
 * @param {string} flightId - Flight ID
 * @returns {Promise<Object>} { flightId, history: [], stats: {} }
 */
export async function getPriceHistory(flightId) {
	const response = await apiClient.get(`/flights/${flightId}/price-history`)
	return response.data?.data || { flightId, history: [], stats: {} }
}

/**
 * Record a new price point for a flight (used by tracking system)
 * @param {string} flightId - Flight ID
 * @param {number} price - Current price
 * @param {string} currency - Currency code ('TRY', 'USD', 'EUR')
 * @returns {Promise<Object>} { flightId, entry, stats }
 */
export async function recordPrice(flightId, price, currency = 'TRY') {
	const response = await apiClient.post('/flights/price-history', {
		flightId,
		price,
		currency,
	})
	return response.data?.data || null
}

/**
 * Get live flight status (simulated)
 * @param {string} flightId - Flight ID
 * @returns {Promise<Object>} { flightId, status, statusLabel, statusColor, gate, estimatedDelay }
 */
export async function getFlightStatus(flightId) {
	const response = await apiClient.get(`/flights/${flightId}/status`)
	return response.data?.data || null
}
