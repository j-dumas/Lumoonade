const axios = require('axios')
const { TopGainer } = require('../db/model/asset')
const { info } = require('../utils/logging')

async function fetchTopGainers() {
	const res = await axios.get('https://coincodex.com/api/coincodexcoins/get_gainers_losers/100/')
	data = res.data['1H']['top_gainers']
	data.forEach((element) => {
		const asset = new TopGainer({ slug: element.symbol })
		asset.save()
	})
	info('DB', 'Top Gainers added')
}

async function modifyTopGainers() {
	const res = await axios.get('https://coincodex.com/api/coincodexcoins/get_gainers_losers/100/')
	data = res.data['1D']['top_gainers']
	await TopGainer.deleteMany({})
	data.forEach((element) => {
		const asset = new TopGainer({ slug: element.symbol })
		asset.save()
	})
	info('DB', 'Top Gainers changed')
}

module.exports = { fetchTopGainers, modifyTopGainers }
