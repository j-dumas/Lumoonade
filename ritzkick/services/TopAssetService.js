const axios = require('axios')
const { TopGainer, TopLoser } = require('../db/model/asset')
const { info } = require('../utils/logging')

const options = {
	gainers: {
		name: 'Top Gainers',
		model: TopGainer,
		collection: 'topgainers',
		api_name: 'top_gainers'
	},
	losers: {
		name: 'Top Losers',
		model: TopLoser,
		collection: 'toplosers',
		api: 'top_losers'
	}
}

async function fetchTopAssets(option) {
	const res = await axios.get('https://coincodex.com/api/coincodexcoins/get_gainers_losers/100/')
	const data = res.data['1H'][option.api_name]
	for (const element of data) {
		const asset = await new option.model({ slug: element.symbol })
		await asset.save()
	}
	info('DB', `${option.name} added`)
}

async function modifyTopAssets(option) {
	const res = await axios.get('https://coincodex.com/api/coincodexcoins/get_gainers_losers/100/')
	const data = res.data['1D'][option.api_name]
	await option.model.deleteMany({})
	for (const element of data) {
		const asset = await new option.model({ slug: element.symbol })
		await asset.save()
	}
	info('DB', `${option.name} changed`)
}

module.exports = { fetchTopAssets, modifyTopAssets, options }
