import axios from 'axios'
import yahoo from '../utils/yahoo'
const cc = require('../app/data/symbols.json')

const paths = require('../api/routes.json')

const Functions = {
	async GetAllAvailableSlug() {
		let slugs = []
		Object.keys(cc).forEach((el) => {
			let slug = el
			let name = cc[slug]

			slugs.push(slug.toLowerCase())
		})
		return slugs
	},

	async GetSCryptocurrencySlugsBySeach(keyword, page = 0, limit = 16) {
		const URI = `/api/assets/search/${keyword}?page${page}&limit=${limit}`

		let response = await fetch(URI)

		let json = await response.json()
		if (json.assets) json.assets.map((el) => el.symbol = el.symbol.toString().toUpperCase())

		if (!json || json == undefined) json = []
		return json
	},

	async GetAllCryptocurrencySlugs(page = 0, limit = 16) {
		const URI = `/api/assets/all?page${page}&limit=${limit}`

		var reponse = await fetch(URI)
		var json = reponse.json()

		return json
	},

	async GetCryptocurrencyInformationsBySlug(slug) {
		const URI = paths.assets.search.yahoo

		var reponse = await fetch(`${URI}${slug}`)
		var json = reponse.json()

		return json
	},

	async GetTopPopularCryptocurrencies(page = 0, limit = 8) {
		const URI = `/api/assets/popular?page${page}&limit=${limit}`

		var reponse = await fetch(URI)
		var json = reponse.json()

		return json
	},

	async GetTopGainersCryptocurrencies(top = 3) {
		const URI = `/api/assets/top/gainers?page1&limit=${top}`

		var reponse = await fetch(URI)
		var json = reponse.json()

		return json
	},

	async GetCryptocurrencyChartDataBySlug(slug, dateRange, interval) {
		const URI = paths.assets.chart

		var reponse = await fetch(`${URI}${slug}?dateRange=${dateRange}&interval=${interval}`)
		var json = await reponse.json()

		return json
	},

	GetDummyChartData(slug) {
		return [
			{
				symbol: slug,
				response: [
					{
						meta: {
							currency: 'USD',
							symbol: `${slug}-USD`,
							exchangeName: 'CCC',
							instrumentType: 'CRYPTOCURRENCY',
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
