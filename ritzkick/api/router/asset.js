const express = require('express')
const mongoose = require('mongoose')
const { Asset, Popular } = require('../../db/model/asset')
const crypto = require('../../application/crypto/crypto')

const pagination = require('../middleware/pagination')

const { parser, refactorSymbolData, fetchSymbol, fetchMarketData } = require('../../utils/yahoo')
const { fetchTopAssets, modifyTopAssets, options } = require('../../services/TopAssetService')
const { TopGainer, TopLoser } = require('../../db/model/top_asset')
const { fetchPopularAssets, modifyPopularAssets } = require('../../services/PopularAssetService')
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

router.get('/api/assets/all', pagination, async (req, res) => {
	try {
		const assets = await Asset.find().limit(req.limit).skip(req.skipIndex).exec()
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		res.status(200).send({ assets: assets, page: req.page, count: assets.length })
	} catch (e) {
		res.status(404).send({
			error: e.message
		})
	}
})

router.get('/api/assets/top/gainers', pagination, async (req, res) => {
	try {
		await verifyTopAssets(options.gainers)
		const assets = await TopGainer.find().sort({ percentage: -1 }).limit(req.limit).skip(req.skipIndex).exec()
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		res.status(200).send({ assets: assets, page: req.page, count: assets.length })
	} catch (e) {
		res.status(500).send({ error: e.message })
	}
})

router.get('/api/assets/top/losers', pagination, async (req, res) => {
	try {
		await verifyTopAssets(options.losers)
		const assets = await TopLoser.find().sort({ percentage: 1 }).limit(req.limit).skip(req.skipIndex).exec()
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		res.status(200).send({ assets: assets, page: req.page, count: assets.length })
	} catch (e) {
		res.status(500).send({ error: e.message })
	}
})

router.get('/api/assets/popular', pagination, async (req, res) => {
	try {
		const isEmpty = await Popular.isEmpty('populars')
		if (isEmpty) await fetchPopularAssets()
		else {
			let datesAreSame = await checkDatesAndHours(Popular)
			if (!datesAreSame) await modifyPopularAssets()
		}

		const assets = await Popular.find().limit(req.limit).skip(req.skipIndex).exec()
		if (!assets || assets.length === 0) {
			throw new Error('Unable to fetch assets')
		}
		res.status(200).send({ assets: assets, page: req.page, count: assets.length })
	} catch (e) {
		res.status(500).send({ error: e.message })
	}
})

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

async function verifyTopAssets(option) {
	const isEmpty = await option.model.isEmpty(option.collection)
	if (isEmpty) await fetchTopAssets(option)
	else {
		let datesAreSame = await checkDatesAndHours(option.model)
		if (!datesAreSame) await modifyTopAssets(option)
	}
}

async function checkDatesAndHours(model) {
	const data = await model.findOne()
	let update = data.updatedAt.toISOString()
	update = update.substring(update.indexOf('T') + 1, update.indexOf(':'))

	let date = new Date().toISOString()
	date = date.substring(date.indexOf('T') + 1, date.indexOf(':'))
	return update == date
}

module.exports = router
