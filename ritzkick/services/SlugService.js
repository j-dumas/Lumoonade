const fs = require('fs')
const { Asset } = require('../db/model/asset')
const cc = require('cryptocurrencies')

async function addSlugsToDB() {
	const isEmpty = await Asset.isEmpty('assets')

	if (isEmpty) {
		createAsset()
	}
}

function createAsset() {
	Object.keys(cc).forEach(el => {
		let slug = el
		let name = cc[slug]
		console.log(slug, name)

		const asset = new Asset({ symbol: slug, name: name })
		asset.save()
	})
}

function readSlugs() {
	const txt = fs.readFileSync(`${__dirname}/../application/data/symbols.txt`, 'utf-8')
	const slugs = txt.split('\n')
	return slugs
}

module.exports = addSlugsToDB
