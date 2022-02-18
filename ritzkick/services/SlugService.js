const fs = require('fs')
const { Asset } = require('../db/model/asset')

async function addSlugsToDB() {
	const isEmpty = await Asset.isEmpty('assets')

	if (isEmpty) {
		const slugs = readSlugs()
		slugs.forEach((element) => {
			const asset = new Asset({ slug: element })
			asset.save()
		})
	}
}

function readSlugs() {
	const txt = fs.readFileSync(`${__dirname}/../application/data/slugs.txt`, 'utf-8')
	const slugs = txt.split('\n')
	return slugs
}

module.exports = addSlugsToDB
