const fs = require('fs')
const { Asset } = require('../db/model/asset')
const cryptocurrencies = require('../application/data/symbols.json')

async function addSlugsToDB() {
	const isEmpty = await Asset.isEmpty('assets')

	if (isEmpty) {
		createAssets()
	}
}

function createAssets() {
	Object.keys(cryptocurrencies).forEach((element) => {
		const asset = new Asset({ symbol: element, name: cryptocurrencies[element] })
		asset.save()
	})
}

module.exports = addSlugsToDB
