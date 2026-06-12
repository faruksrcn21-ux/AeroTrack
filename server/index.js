import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

// ── Config ──────────────────────────────────────────────
dotenv.config({ path: '../.env' })

const app = express()
const PORT = process.env.PORT || 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Data directory for JSON persistence
const DATA_DIR = join(__dirname, 'data')
const BOOKINGS_FILE = join(DATA_DIR, 'bookings.json')
const PRICE_HISTORY_FILE = join(DATA_DIR, 'price-history.json')

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ── Locale Mapping ──────────────────────────────────────
// Maps frontend language codes to Sky Scrapper API locale/market/countryCode
const LOCALE_MAP = {
	tr: { locale: 'tr-TR', market: 'TR', countryCode: 'TR' },
	en: { locale: 'en-US', market: 'US', countryCode: 'US' },
}

// ═══════════════════════════════════════════════════════
// HELPER: Ensure data directory and files exist
// ═══════════════════════════════════════════════════════
async function ensureDataFiles() {
	if (!existsSync(DATA_DIR)) {
		await mkdir(DATA_DIR, { recursive: true })
	}
	if (!existsSync(BOOKINGS_FILE)) {
		await writeFile(BOOKINGS_FILE, '[]', 'utf-8')
	}
	if (!existsSync(PRICE_HISTORY_FILE)) {
		await writeFile(PRICE_HISTORY_FILE, '{}', 'utf-8')
	}
}

// ── JSON file read/write helpers ──
async function readJSON(filePath) {
	try {
		const data = await readFile(filePath, 'utf-8')
		return JSON.parse(data)
	} catch {
		// Return default based on file
		return filePath === BOOKINGS_FILE ? [] : {}
	}
}

async function writeJSON(filePath, data) {
	await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// ── UUID Generator ──
function generateId() {
	try {
		return crypto.randomUUID()
	} catch {
		// Fallback for older Node.js versions
		return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
	}
}

// ═══════════════════════════════════════════════════════
// HELPER: Get Airport EntityId from Sky Scrapper
// ═══════════════════════════════════════════════════════
async function getAirportEntityId(query, locale = 'tr-TR') {
	try {
		const response = await axios.get(
			'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
			{
				params: { query, locale },
				headers: {
					'x-rapidapi-key': process.env.RAPIDAPI_KEY,
					'x-rapidapi-host': process.env.RAPIDAPI_HOST,
				},
			},
		)
		const result = response.data?.data?.[0]
		// Safe fallback lookup key
		const flightParams = result?.navigation?.relevantFlightParams
		if (flightParams) {
			return { skyId: flightParams.skyId, entityId: flightParams.entityId }
		}
		return result ? { skyId: result.skyId, entityId: result.entityId } : null
	} catch (error) {
		console.error('Airport search error:', error.response?.data || error.message)
		return null
	}
}

// ═══════════════════════════════════════════════════════
// 0) HEALTH CHECK
// ═══════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', message: 'AeroTrack proxy is working..' })
})

// ═══════════════════════════════════════════════════════
// 1) AIRPORT AUTOCOMPLETE PROXY — /api/airports
// ═══════════════════════════════════════════════════════
app.get('/api/airports', async (req, res) => {
	const { query, locale } = req.query

	if (!query || query.length < 2) {
		return res
			.status(400)
			.json({ error: 'The query parameter must be at least 2 characters.' })
	}

	// Resolve locale from frontend language or use provided value
	const resolvedLocale = LOCALE_MAP[locale]?.locale || locale || 'tr-TR'

	try {
		const response = await axios.get(
			'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
			{
				params: { query, locale: resolvedLocale },
				headers: {
					'x-rapidapi-key': process.env.RAPIDAPI_KEY,
					'x-rapidapi-host': process.env.RAPIDAPI_HOST,
				},
			},
		)

		// Normalize results for frontend consumption
		const airports = (response.data?.data || []).map(item => {
			const flightParams = item.navigation?.relevantFlightParams
			return {
				skyId: flightParams?.skyId || item.skyId || '',
				entityId: flightParams?.entityId || item.entityId || '',
				name: item.presentation?.title || item.name || '',
				subtitle: item.presentation?.subtitle || '',
				iata: flightParams?.skyId || item.skyId || '',
				city: item.presentation?.subtitle?.split(',')[0]?.trim() || '',
				country: item.presentation?.subtitle?.split(',')[1]?.trim() || '',
				type: item.navigation?.entityType || 'AIRPORT',
			}
		})

		res.json({ status: true, data: airports })
	} catch (error) {
		console.error(
			'Airport search error:',
			error.response?.data || error.message,
		)
		res.status(error.response?.status || 500).json({
			error: 'Airport data could not be retrieved.',
			detail: error.response?.data?.message || error.message,
		})
	}
})

// ═══════════════════════════════════════════════════════
// 2 & 3) FLIGHT SEARCH — Extended with round-trip,
//         passengers, cabin class, locale & currency
// ═══════════════════════════════════════════════════════
app.get('/api/flights/search', async (req, res) => {
	const {
		origin,
		destination,
		date,
		returnDate,
		adults = '1',
		children = '0',
		infants = '0',
		cabinClass = 'economy',
		currency = 'TRY',
		locale = 'tr',
		sortBy = 'best',
	} = req.query

	// Backend validation
	if (!origin || !destination || !date) {
		return res.status(400).json({
			error: 'The origin, destination, and date parameters are mandatory..',
		})
	}

	// Resolve locale/market/countryCode from frontend language
	const localeConfig = LOCALE_MAP[locale] || LOCALE_MAP.tr
	const resolvedLocale = localeConfig.locale
	const resolvedMarket = localeConfig.market
	const resolvedCountryCode = localeConfig.countryCode

	try {
		// Step 1: Obtain the Airport Entity ID sequentially to prevent rate limiting (Too many requests)
		const originData = await getAirportEntityId(origin, resolvedLocale)
		await new Promise(resolve => setTimeout(resolve, 1000))
		const destinationData = await getAirportEntityId(destination, resolvedLocale)

		if (!originData || !destinationData) {
			return res.status(404).json({ error: 'Airport not found.' })
		}

		// Step 2: Build search parameters
		const searchParams = {
			originSkyId: originData.skyId,
			destinationSkyId: destinationData.skyId,
			originEntityId: originData.entityId,
			destinationEntityId: destinationData.entityId,
			date,
			adults: String(adults),
			currency,
			locale: resolvedLocale,
			market: resolvedMarket,
			countryCode: resolvedCountryCode,
			cabinClass,
			sortBy,
		}

		// Add optional parameters
		if (returnDate) {
			searchParams.returnDate = returnDate
		}
		if (Number(children) > 0) {
			searchParams.children = String(children)
		}
		if (Number(infants) > 0) {
			searchParams.infants = String(infants)
		}

		// Step 3: Search for flights
		const flightResponse = await axios.get(
			'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete',
			{
				params: searchParams,
				headers: {
					'x-rapidapi-key': process.env.RAPIDAPI_KEY,
					'x-rapidapi-host':
						process.env.RAPIDAPI_HOST || 'sky-scrapper.p.rapidapi.com',
				},
			},
		)

		res.json(flightResponse.data)
	} catch (error) {
		console.error(
			'Sky Scrapper API error:',
			error.response?.data || error.message,
		)
		res.status(error.response?.status || 500).json({
			error: 'Flight data could not be retrieved.',
			detail: error.response?.data?.message || error.message,
		})
	}
})

// ═══════════════════════════════════════════════════════
// 4) BOOKING DATABASE API — /api/bookings
// ═══════════════════════════════════════════════════════

// GET /api/bookings — List all bookings
app.get('/api/bookings', async (req, res) => {
	try {
		const bookings = await readJSON(BOOKINGS_FILE)
		res.json({ status: true, data: bookings })
	} catch (error) {
		console.error('Error reading bookings:', error.message)
		res.status(500).json({ error: 'Bookings could not be retrieved.' })
	}
})

// GET /api/bookings/:id — Get single booking
app.get('/api/bookings/:id', async (req, res) => {
	try {
		const bookings = await readJSON(BOOKINGS_FILE)
		const booking = bookings.find(b => b.id === req.params.id)

		if (!booking) {
			return res.status(404).json({ error: 'Booking not found.' })
		}

		res.json({ status: true, data: booking })
	} catch (error) {
		console.error('Error reading booking:', error.message)
		res.status(500).json({ error: 'Booking could not be retrieved.' })
	}
})

// POST /api/bookings — Create a new booking
app.post('/api/bookings', async (req, res) => {
	try {
		const { flight, passenger, payment, seat } = req.body

		// Validate required fields
		if (!flight || !passenger) {
			return res.status(400).json({
				error: 'Flight and passenger information are required.',
			})
		}

		const bookings = await readJSON(BOOKINGS_FILE)

		const newBooking = {
			id: generateId(),
			flight,
			passenger: {
				firstName: passenger.firstName || '',
				lastName: passenger.lastName || '',
				tcNumber: passenger.tcNumber || '',
			},
			payment: payment
				? {
					cardLastFour: payment.cardNumber
						? payment.cardNumber.slice(-4)
						: '****',
					cardHolder: payment.cardHolder || '',
				}
				: null,
			seat: seat || null,
			purchasedAt: new Date().toISOString(),
			status: 'confirmed',
			boardingPass: {
				gate: `${Math.floor(Math.random() * 30 + 1)}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
				boardingGroup: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
				sequence: Math.floor(Math.random() * 150 + 1),
			},
		}

		bookings.push(newBooking)
		await writeJSON(BOOKINGS_FILE, bookings)

		res.status(201).json({ status: true, data: newBooking })
	} catch (error) {
		console.error('Error creating booking:', error.message)
		res.status(500).json({ error: 'Booking could not be created.' })
	}
})

// DELETE /api/bookings/:id — Cancel (delete) a booking
app.delete('/api/bookings/:id', async (req, res) => {
	try {
		const bookings = await readJSON(BOOKINGS_FILE)
		const index = bookings.findIndex(b => b.id === req.params.id)

		if (index === -1) {
			return res.status(404).json({ error: 'Booking not found.' })
		}

		const cancelled = bookings.splice(index, 1)[0]
		cancelled.status = 'cancelled'
		cancelled.cancelledAt = new Date().toISOString()

		await writeJSON(BOOKINGS_FILE, bookings)

		res.json({ status: true, data: cancelled })
	} catch (error) {
		console.error('Error cancelling booking:', error.message)
		res.status(500).json({ error: 'Booking could not be cancelled.' })
	}
})

// ═══════════════════════════════════════════════════════
// 5) PRICE HISTORY & FLIGHT STATUS SERVICES
// ═══════════════════════════════════════════════════════

// ── Flight Status Constants ──
const FLIGHT_STATUSES = [
	{ key: 'scheduled', label: 'Scheduled', color: '#888' },
	{ key: 'checkin', label: 'Check-in Open', color: '#3b82f6' },
	{ key: 'boarding', label: 'Boarding', color: '#f59e0b' },
	{ key: 'departed', label: 'Departed', color: '#10b981' },
	{ key: 'delayed', label: 'Delayed', color: '#ef4444' },
	{ key: 'landed', label: 'Landed', color: '#6366f1' },
]

// In-memory store for live flight statuses (simulated)
const flightStatusStore = {}

// GET /api/flights/:id/price-history — Get price history for a flight
app.get('/api/flights/:id/price-history', async (req, res) => {
	try {
		const history = await readJSON(PRICE_HISTORY_FILE)
		const flightHistory = history[req.params.id] || []

		res.json({
			status: true,
			data: {
				flightId: req.params.id,
				history: flightHistory,
				stats: calculatePriceStats(flightHistory),
			},
		})
	} catch (error) {
		console.error('Error reading price history:', error.message)
		res.status(500).json({ error: 'Price history could not be retrieved.' })
	}
})

// POST /api/flights/price-history — Record a new price point
app.post('/api/flights/price-history', async (req, res) => {
	try {
		const { flightId, price, currency = 'TRY' } = req.body

		if (!flightId || price == null) {
			return res
				.status(400)
				.json({ error: 'flightId and price are required.' })
		}

		const history = await readJSON(PRICE_HISTORY_FILE)

		if (!history[flightId]) {
			history[flightId] = []
		}

		const entry = {
			price: Number(price),
			currency,
			timestamp: new Date().toISOString(),
		}

		history[flightId].push(entry)

		// Keep only the last 100 entries per flight
		if (history[flightId].length > 100) {
			history[flightId] = history[flightId].slice(-100)
		}

		await writeJSON(PRICE_HISTORY_FILE, history)

		res.status(201).json({
			status: true,
			data: {
				flightId,
				entry,
				stats: calculatePriceStats(history[flightId]),
			},
		})
	} catch (error) {
		console.error('Error recording price:', error.message)
		res.status(500).json({ error: 'Price could not be recorded.' })
	}
})

// GET /api/flights/:id/status — Get live flight status (simulated)
app.get('/api/flights/:id/status', (req, res) => {
	const flightId = req.params.id

	// If no status exists yet, initialize with 'scheduled'
	if (!flightStatusStore[flightId]) {
		flightStatusStore[flightId] = {
			flightId,
			status: 'scheduled',
			gate: null,
			estimatedDelay: 0,
			updatedAt: new Date().toISOString(),
		}
	}

	const status = flightStatusStore[flightId]
	const statusInfo = FLIGHT_STATUSES.find(s => s.key === status.status)

	// Simulate status progression — each call may advance the status
	const currentIdx = FLIGHT_STATUSES.findIndex(
		s => s.key === status.status,
	)
	const shouldAdvance = Math.random() > 0.5 // 50% chance to advance
	if (shouldAdvance && currentIdx < FLIGHT_STATUSES.length - 1) {
		const nextStatus = FLIGHT_STATUSES[currentIdx + 1]
		status.status = nextStatus.key
		status.updatedAt = new Date().toISOString()

		// Assign gate at boarding
		if (nextStatus.key === 'boarding') {
			status.gate = `${Math.floor(Math.random() * 30 + 1)}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`
		}

		// Add delay info for delayed status
		if (nextStatus.key === 'delayed') {
			status.estimatedDelay = Math.floor(Math.random() * 90 + 15) // 15-105 min
		}
	}

	res.json({
		status: true,
		data: {
			...status,
			statusLabel: statusInfo?.label || status.status,
			statusColor: statusInfo?.color || '#888',
			availableStatuses: FLIGHT_STATUSES,
		},
	})
})

// ── Helper: Calculate price statistics ──
function calculatePriceStats(historyArray) {
	if (!historyArray || historyArray.length === 0) {
		return { min: 0, max: 0, avg: 0, current: 0, trend: 'stable', count: 0 }
	}

	const prices = historyArray.map(h => h.price)
	const min = Math.min(...prices)
	const max = Math.max(...prices)
	const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
	const current = prices[prices.length - 1]

	// Determine trend from last 5 entries
	let trend = 'stable'
	if (prices.length >= 2) {
		const recent = prices.slice(-5)
		const first = recent[0]
		const last = recent[recent.length - 1]
		const changePercent = ((last - first) / first) * 100
		if (changePercent > 2) trend = 'rising'
		else if (changePercent < -2) trend = 'falling'
	}

	return { min, max, avg, current, trend, count: prices.length }
}

// ═══════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════
await ensureDataFiles()

app.listen(PORT, () => {
	console.log(`✈️  AeroTrack proxy server runs at http://localhost:${PORT}.`)
	console.log(`📁  Data directory: ${DATA_DIR}`)
})
