const Functions = {
	async GetCryptocurrencyInformationsBySlug(slug, dateRange, interval) {
		const URL = 'localhost:3000'
		const URI = '/api/crypto/search/'
		slug = 'ETH-CAD'

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
	
	GetCryptoChartData() {
		const data = [
			{
				name: 'Bitcoin',
				abbreviation: 'BTC',
				price: 50000,
				x: [
					'10h',
					'11h',
					'12h',
					'13h',
					'14h',
					'15h',
					'16h',
					'17h',
					'18h',
					'19h',
					'20h',
					'21h',
					'22h',
					'23h',
					'00h',
					'01h',
					'02h',
					'03h',
					'04h',
					'05h',
					'06h',
					'07h',
					'08h',
					'09h',
					'10h',
					,
					'11h',
					'12h',
					'13h',
					'14h',
					'15h',
					'16h',
					'17h',
					'18h',
					'19h',
					'20h',
					'21h',
					'22h',
					'23h',
					'00h',
					'01h',
					'02h',
					'03h',
					'04h',
					'05h',
					'06h',
					'07h',
					'08h',
					'09h',
					'10h',
					'11h',
					'17h',
					'18h',
					'19h',
					'20h',
					'21h',
					'22h',
					'23h',
					'00h',
					'01h',
					'02h',
					'03h',
					'04h',
					'05h',
					'06h',
					'07h',
					'08h',
					'09h',
					'10h',
					,
					'11h',
					'12h',
					'13h',
					'14h',
					'15h',
					'16h',
					'17h',
					'18h',
					'19h',
					'20h',
					'21h',
					'22h',
					'23h',
					'00h',
					'01h',
					'02h',
					'03h',
					'04h',
					'05h',
				],
				value: [
					49000,
					48000,
					49000,
					49500,
					49550,
					49000,
					50000,
					50000,
					50050,
					50000,
					51000,
					49000,
					49500,
					49550,
					50000,
					50000,
					55000,
					50500,
					50500,
					49000,
					49000,
					49000,
					48000,
					50000,
					49000,
					48000,
					49000,
					49500,
					49550,
					49000,
					50000,
					50000,
					50050,
					50000,
					51000,
					49000,
					49500,
					49550,
					50000,
					50000,
					55000,
					50500,
					50500,
					49000,
					49000,
					49000,
					48000,
					50000,
					55555,
					Math.floor(Math.random() * 20000) + 50000,
				],
				color: 'orange',
				maxValue: 56000,
			} /*,
			{
				name: "Ethereum",
				abbreviation: 'ETH',
				price: 3400,
				x: ['10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h', '21h', '22h','23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h'], 
				value: [3400, 3300,3400,3450,3500,3500,3550,3350,3400,3500,3400,3400,3300, 3300,3400,3450,3500,3500,3550,3350,3400,3500,3400,3400],
				color:"white"
			},
			{
				name: "Cardano",
				abbreviation: 'ADA',
				price: 1.25,
				x: ['10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h', '21h', '22h','23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h'], 
				value: [1.25, 1.25,1.25,1.25,1.25,1.25,1.25,1.25,1.25,1.25,1.5,1.5,1.5, 1.5,1.5,1.25,1.25,1.45,1.45,1.6,1.4,1.4,1.3,1.2],
				color: "blue"
			},*/
		]
	
		return data
	}
}

export default Functions