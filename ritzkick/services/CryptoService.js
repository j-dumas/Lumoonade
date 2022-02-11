import axios from 'axios'
import yahoo from '../utils/yahoo'

const Functions = {
	async GetCryptocurrencyInformationsBySlug(slug) {
		const URL = 'localhost:3000'
		const URI = '/api/crypto/search/'

		var reponse = await fetch((URI+slug))
		var json = reponse.json()

		return json
	},

	async GetTopPopularCryptocurrencies(top = 10) {
		return [
			{
				currency: 'CAD',
				regularMarketChange: 1050,
				regularMarketChangePercent: 1.5,
				regularMarketPrice: 50120,
				regularMarketVolume: 0,
				fromCurrency: 'BTC',
				marketCap: 1035674779648,
				volume24Hr: 39693062144,
				shortName: 'Bitcoin - CAD',
			},
			{
				currency: 'CAD',
				regularMarketChange: 50,
				regularMarketChangePercent: 1.15,
				regularMarketPrice: 3900,
				regularMarketVolume: 0,
				fromCurrency: 'ETH',
				marketCap: 463130066944,
				volume24Hr: 21376692224,
				shortName: 'Ethereum - CAD',
			},
			{
				currency: 'CAD',
				regularMarketChange: -0.054418683,
				regularMarketChangePercent: -3.605,
				regularMarketPrice: '1.4550',
				regularMarketVolume: '2826549760',
				fromCurrency: 'ADA',
				marketCap: '48880242688',
				volume24Hr: '2826549760',
				shortName: 'Cardano - CAD',
			},
		]

		const URI = '/api/crypto/popular/'

		var reponse = await fetch((URI+slug))
		var json = reponse.json()

		return json
	},

	async GetTopEfficientCryptocurrencies(top = 3) {
		const URI = '/api/crypto/ranking/'

		var reponse = await fetch((URI+slug))
		var json = reponse.json()

		return json
	},

	async GetCryptocurrencyChartDataBySlug(slug, dateRange, interval) {
		const URL = 'localhost:3000'
		const URI = '/api/crypto/chart/'

		var reponse = await fetch((URI+slug+`?dateRange=${dateRange}&interval=${interval}`))
		var json = await reponse.json()

		return json
	},

	async GetDummyData() {
		return [
			{
				symbol: "ETH-CAD",
				response: [
					{
						meta: {
							currency: "CAD",
							symbol: "ETH-CAD",
							exchangeName: "CCC",
							instrumentType: "CRYPTOCURRENCY",
							firstTradeDate: 1510358400,
							regularMarketTime: 1644524822,
							gmtoffset: 0,
							timezone: "UTC",
							exchangeTimezoneName: "UTC",
							regularMarketPrice: 3969.7336,
							chartPreviousClose: 2214.7583,
							priceHint: 2,
							currentTradingPeriod: {
								pre: {
									timezone: "UTC",
									start: 1644451200,
									end: 1644451200,
									gmtoffset: 0
								},
								regular: {
									timezone: "UTC",
									start: 1644451200,
									end: 1644537540,
									gmtoffset: 0
								},
								post: {
									timezone: "UTC",
									start: 1644537540,
									end: 1644537540,
									gmtoffset: 0
								}
							},
							dataGranularity: "1d",
							range: "1y",
							validRanges: [
								"1d",
								"5d",
								"1mo",
								"3mo",
								"6mo",
								"1y",
								"2y",
								"5y",
								"ytd",
								"max"
							]
						},
						timestamp: [
							0
						],
						indicators: {
							quote: [
								{
									close: [
										0
									]
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