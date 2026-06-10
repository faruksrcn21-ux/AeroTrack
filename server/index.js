import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config({ path: '../.env' })

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', message: 'AeroTrack proxy is working..' })
})

// Flight Search Endpoint — Sky Scraper API proxy
app.get('/api/flights/search', async (req, res) => {
	const { origin, destination, date } = req.query

	// backend validation
	if (!origin || !destination || !date) {
		return res.status(400).json({
			error: 'The origin, destination, and date parameters are mandatory..',
		})
	}

	try {
		// Step 1: Obtain the Airport Entity ID
		const [originData, destinationData] = await Promise.all([
			getAirportEntityId(origin),
			getAirportEntityId(destination),
		])

		if (!originData || !destinationData) {
			return res.status(404).json({ error: 'Airport not found.' })
		}

		// Step 2: Search for flights
		const flightResponse = await axios.get(
			'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete',
			{
				params: {
					originSkyId: originData.skyId,
					destinationSkyId: destinationData.skyId,
					originEntityId: originData.entityId,
					destinationEntityId: destinationData.entityId,
					date,
					adults: '1',
					currency: 'TRY',
					locale: 'tr-TR',
					market: 'TR',
					countryCode: 'TR',
					cabinClass: 'economy',
					sortBy: 'best',
				},
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

// Helper: Get Airport EntityId
async function getAirportEntityId(query) {
	try {
		const response = await axios.get(
			'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
			{
				params: { query, locale: 'tr-TR' },
				headers: {
					'x-rapidapi-key': process.env.RAPIDAPI_KEY,
					'x-rapidapi-host': process.env.RAPIDAPI_HOST,
				},
			},
		)
		const result = response.data?.data?.[0]
		return result ? { skyId: result.skyId, entityId: result.entityId } : null
	} catch {
		return null
	}
}

app.listen(PORT, () => {
	console.log(`✈️  AeroTrack proxy server runs at http://localhost:${PORT}.`)
})
