import axios from 'axios'
import yahoo from '../utils/yahoo'

const Functions = {
	async GetSCryptocurrencySlugsBySeach(keyword, page = 0, limit = 16) {
		const URI = `/api/assets/search/${keyword}?page${page}&limit=${limit}`

		var reponse = await fetch(URI)
		var json = reponse.json()

		return json
	},

	async GetAllCryptocurrencySlugs(page = 0, limit = 16) {
		const URI = `/api/assets/all?page${page}&limit=${limit}`

		var reponse = await fetch(URI)
		var json = reponse.json()

		return json
	},

	async GetCryptocurrencyInformationsBySlug(slug) {
		const URL = 'localhost:3000'
		const URI = '/api/crypto/search/'

		var reponse = await fetch(URI + slug)
		var json = reponse.json()

		return json
	},

	async GetTopPopularCryptocurrencies(top = 10) {
		const URI = '/api/crypto/popular/'

		var reponse = await fetch(URI)
		var json = reponse.json()

		return json
	},

	async GetTopEfficientCryptocurrencies(top = 3) {
		const URI = '/api/crypto/ranking/'

		var reponse = await fetch(URI)
		var json = reponse.json()

		return json
	},

	async GetCryptocurrencyChartDataBySlug(slug, dateRange, interval) {
		const URL = 'localhost:3000'
		const URI = '/api/crypto/chart/'

		var reponse = await fetch(URI + slug + `?dateRange=${dateRange}&interval=${interval}`)
		var json = await reponse.json()

		return json
	},

	async GetDummyData() {
		return [
			{
				symbol: 'ETH-CAD',
				response: [
					{
						meta: {
							currency: 'CAD',
							symbol: 'ETH-CAD',
							exchangeName: 'CCC',
							instrumentType: 'CRYPTOCURRENCY',
							firstTradeDate: 1510358400,
							regularMarketTime: 1644524822,
							gmtoffset: 0,
							timezone: 'UTC',
							exchangeTimezoneName: 'UTC',
							regularMarketPrice: 3969.7336,
							chartPreviousClose: 2214.7583,
							priceHint: 2,
							currentTradingPeriod: {
								pre: {
									timezone: 'UTC',
									start: 1644451200,
									end: 1644451200,
									gmtoffset: 0
								},
								regular: {
									timezone: 'UTC',
									start: 1644451200,
									end: 1644537540,
									gmtoffset: 0
								},
								post: {
									timezone: 'UTC',
									start: 1644537540,
									end: 1644537540,
									gmtoffset: 0
								}
							},
							dataGranularity: '1d',
							range: '1y',
							validRanges: ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', 'ytd', 'max']
						},
						timestamp: [0],
						indicators: {
							quote: [
								{
									close: [0]
								}
							]
						}
					}
				]
			}
		]
	}
}

export default Functions
