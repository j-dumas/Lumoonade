const axios = require('axios')
const { TopGainer, TopLoser } = require('../db/model/top_asset')
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
		api_name: 'top_losers'
	}
}

const URL = 'https://coincodex.com/api/coincodexcoins/get_gainers_losers/100/'

async function fetchTopAssets(option) {
	const res = await axios.get(URL)
	const data = res.data['1H'][option.api_name]
	for (const element of data) {
		await addToDB(option.model, element)
	}
	info('DB', `${option.name} added`)
}
async function modifyTopAssets(option) {
	const res = await axios.get(URL)
	const data = res.data['1D'][option.api_name]
	await option.model.deleteMany({})
	for (const element of data) {
		await addToDB(option.model, element)
	}
	info('DB', `${option.name} changed`)
}

async function addToDB(model, element) {
	const asset = await new model({ slug: element.symbol, percentage: element.price_change_1D_percent })
	await asset.save()
}

module.exports = { fetchTopAssets, modifyTopAssets, options }
