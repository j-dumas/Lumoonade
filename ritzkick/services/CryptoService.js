import axios from 'axios';
import yahoo from '../utils/yahoo';

const Functions = {
	async GetCryptocurrencyInformationsBySlug(slug) {
		const URL = 'localhost:3000';
		const URI = '/api/crypto/search/';

		var reponse = await fetch(URI + slug);
		var json = reponse.json();

		return json;
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
				shortName: 'Bitcoin - CAD'
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
				shortName: 'Ethereum - CAD'
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
				shortName: 'Cardano - CAD'
			}
		];

		const URI = '/api/crypto/popular/';

		var reponse = await fetch(URI + slug);
		var json = reponse.json();

		return json;
	},

	async GetTopEfficientCryptocurrencies(top = 3) {
		const URI = '/api/crypto/ranking/';

		var reponse = await fetch(URI + slug);
		var json = reponse.json();

		return json;
	},

	async GetCryptocurrencyChartDataBySlug(slug, dateRange, interval) {
		const URL = 'localhost:3000';
		const URI = '/api/crypto/chart/';

		var reponse = await fetch(URI + slug);
		var json = await reponse.json();

		return json;
	}
};

export default Functions;
