const fs = require('fs')
const { Asset } = require('../db/model/asset')
const cc = require('cryptocurrencies')

async function addSlugsToDB() {
	const isEmpty = await Asset.isEmpty('assets')

	if (isEmpty) {
		const slugs = readSlugs()
		slugs.forEach((element) => {
			createAsset(element)
		})
	}
}

function createAsset(element) {
	const name = cc[element]
	const asset = new Asset({ symbol: element, name: name })
	asset.save()
}

function readSlugs() {
	const txt = fs.readFileSync(`${__dirname}/../application/data/symbols.txt`, 'utf-8')
	const slugs = txt.split('\n')
	return slugs
}

module.exports = addSlugsToDB
