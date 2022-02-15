const express = require('express')
const mongoose = require('mongoose')
const Asset = require('../../db/model/asset')
const Crypto = require('../../db/model/crypto')
const crypto = require('../../application/crypto/crypto')

const pagination = require('../middleware/pagination')

const { parser, refactorSymbolData, fetchSymbol, fetchMarketData } = require('../../utils/yahoo')
const router = express.Router()

router.get('/api/crypto/search/:slug', async (req, res) => {
	try {
		const slug = req.params.slug
		let data = await fetchMarketData(slug)

		// All the informations we want to fetch from the data received.
		// This will be populate alot depending on how many cryptos we want to fetch
		let want = {
			currency: '',
			regularMarketDayHigh: '',
			regularMarketDayLow: '',
			regularMarketChange: '',
			regularMarketChangePercent: '',
			regularMarketPrice: '',
			regularMarketVolume: '',
			averageDailyVolume3Month: '',
			averageDailyVolume10Day: '',
			coinImageUrl: '',
			fromCurrency: '',
			marketCap: '',
			volume24Hr: '',
			symbol: '',
			shortName: ''
		}

		let response = []

		data.result.forEach((d) => {
			parser(d, want)
			response.push({
				...want
			})
		})

		res.send(response)
	} catch (e) {
		res.status(400).send({
			error: e.message
		})
	}
})

// ----------------------------------------------------------
//				This is the RANKING section
// ----------------------------------------------------------

router.get('/api/crypto/ranking', async (req, res) => {
	try {
		const limit = req.query.limit

		// By default, we want all values DESCENDING (most to less gains)
		const sort = {
			changePercent: 'desc'
		}

		if (req.query.gain) {
			sort.changePercent = req.query.gain
		}

		let assets = await Asset.find({}).sort(sort)
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		if (limit && limit.length > 0) {
			assets.length = Math.min(limit, assets.length)
		}
		res.send(assets)
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/api/crypto/ranking/:slug', async (req, res) => {
	try {
		const exist = await Asset.exists(req.params.slug)
		if (!exist) {
			throw new Error('Could not set a ranking on a non existent asset.')
		}
		let slug = req.params.slug.toLocaleLowerCase()
		let assets = await Asset.find({}).sort({ changePercent: 'desc' })
		if (!assets || assets.length === 0) {
			throw new Error(`Unable to make a ranking about '${slug}' because there are no assets`)
		}
		let ranking = assets.length
		assets.find((asset, postion) => {
			if (asset.slug === slug) {
				ranking = postion
				return true
			}
		})
		res.send({
			slug,
			ranking: ranking + 1,
			rivals: assets.length
		})
	} catch (e) {
		res.status(404).send({
			message: e.message
		})
	}
})

// ----------------------------------------------------------
//				This is the CRYPTO section
// ----------------------------------------------------------

router.get('/api/assets/all', pagination, async (req, res) => {
	try {
		const assets = await Asset.find().limit(req.limit).skip(req.skipIndex).exec()
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		res.send({ assets: assets, page: req.page, count: assets.length })
	} catch (e) {
		res.status(404).send({
			error: e.message
		})
	}
})

router.get('/api/crypto/popular', async (req, res) => {
	try {
		const limit = req.query.limit
		const assets = await Asset.find({}).sort({ searchedCount: 'desc' })
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		if (limit && limit.length > 0) {
			assets.length = Math.min(limit, assets.length)
		}
		res.send(assets)
	} catch (e) {
		res.status(404).send({
			error: e.message
		})
	}
})

router.get('/api/crypto/new', async (req, res) => {
	try {
		const limit = req.query.limit
		let assets = await Asset.find({}).sort({ creationDate: 'desc' })
		if (req.query.time) {
			assets = assets.filter((asset) => {
				const creationDate = new Date(asset.creationDate)
				const currentTime = new Date(Date.now())
				const diff = currentTime.getTime() - creationDate.getTime()
				const days = diff / (1000 * 3600 * 24)
				switch (req.query.time.toLocaleLowerCase()) {
					case 'd':
						return days <= 1
					case 'w':
						return days <= 7
					case 'm':
						return days <= 30
					case 'y':
						return days <= 365
					default:
						throw new Error('Here are all the available time key values! [d, w, m, y]')
				}
			})
		}
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		if (limit && limit.length > 0) {
			assets.length = Math.min(limit, assets.length)
		}
		res.send(assets)
	} catch (e) {
		res.status(404).send({
			error: e.message
		})
	}
})

router.get('/api/crypto/upcoming', async (req, res) => {
	try {
		const limit = req.query.limit
		let assets = await Asset.find({}).sort({ creationDate: 'asc' })
		assets = assets.filter((asset) => {
			const creationDate = new Date(asset.creationDate)
			const currentTime = new Date(Date.now())
			const diff = currentTime.getTime() - creationDate.getTime()
			const days = diff / (1000 * 3600 * 24)
			return days < 0
		})
		if (limit && limit.length > 0) {
			assets.length = Math.min(limit, assets.length)
		}
		res.send(assets)
	} catch (e) {
		res.status(404).send()
	}
})

router.get('/api/crypto/:slug', async (req, res) => {
	try {
		const asset = await Asset.find({ slug: req.params.slug.toLocaleLowerCase() })
		if (!asset || asset.length === 0) {
			throw new Error('Unable to find an asset with a name of ' + (req.params.slug || 'None'))
		}
		res.send(asset)
	} catch (e) {
		res.status(404).send({
			error: e.message
		})
	}
})

// ROUTE TEST
router.get('/api/crypto/chart/:slug', async (req, res) => {
	try {
		const response = await fetchSymbol(req.params.slug, {
			range: req.query.dateRange,
			interval: req.query.interval
		})
		res.send(response)
	} catch (e) {
		res.status(404).send({
			error: e.message
		})
	}
})

module.exports = router
