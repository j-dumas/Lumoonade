const axios = require('axios')
const { Popular } = require('../db/model/asset')
const { info } = require('../utils/logging')

const POPULAR_URL = 'https://price-api.crypto.com/price/v1/tokens?_t=1644964219542'

async function fetchPopularAssets() {
	try {
		const res = await axios.post(POPULAR_URL) // error code: 1020 cloudflare
	} catch (e) {
		console.log(e)
	}
	const data = res.data['data']
	for (const element of data) {
		await addToDB(Popular, element)
	}
	info('DB', 'Popular cryptocurrencies added')
}
async function modifyPopularAssets(option) {
	const res = await axios.get(POPULAR_URL)
	const data = res.data['data']
	Popular.deleteMany({})
	for (const element of data) {
		await addToDB(Popular, element)
	}
	info('DB', 'Popular cryptocurrencies changed')
}

async function addToDB(model, element) {
	const asset = await new model({ slug: element.symbol })
	await asset.save()
}

module.exports = { fetchPopularAssets, modifyPopularAssets }
