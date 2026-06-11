import axios from 'axios'

// Proxy üzerinden API isteği (/api → backend)
const apiClient = axios.create({
	baseURL: '/api',
	timeout: 10000,
})

/**
 * Get all bookings from the backend
 * @returns {Promise<Array>} Booking list
 */
export async function getBookings() {
	const response = await apiClient.get('/bookings')
	return response.data?.data || []
}

/**
 * Get a single booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export async function getBooking(id) {
	const response = await apiClient.get(`/bookings/${id}`)
	return response.data?.data || null
}

/**
 * Create a new booking (purchase a ticket)
 * @param {Object} bookingData - { flight, passenger, payment, seat }
 * @returns {Promise<Object>} Created booking with boardingPass
 */
export async function createBooking(bookingData) {
	const response = await apiClient.post('/bookings', bookingData)
	return response.data?.data || null
}

/**
 * Cancel (delete) a booking
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Cancelled booking data
 */
export async function cancelBooking(id) {
	const response = await apiClient.delete(`/bookings/${id}`)
	return response.data?.data || null
}
