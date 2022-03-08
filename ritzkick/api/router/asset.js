const express = require('express')
const { Asset } = require('../../db/model/asset')
const pagination = require('../middleware/pagination')

const { parser, fetchSymbol, fetchMarketData } = require('../../utils/yahoo')
const { fetchTopAssets, modifyTopAssets, options } = require('../../services/TopAssetService')
const { TopGainer, TopLoser } = require('../../db/model/top_asset')
const router = express.Router()

const paths = require('../routes.json')
const { sendError, ServerError, NotFoundHttpError } = require('../../utils/http_errors')

/**
 * Asset Response Model
 * @typedef {object} AssetResponse
 * @property {string} _id - ID of the asset
 * @property {string} symbol - Symbol of the asset
 * @property {string} name - Name of the asset
 * @property {number} searchedCount - Number of times the asset has been searched
 */

/**
 * Top Asset Response Model
 * @typedef {object} TopAssetResponse
 * @property {string} _id - ID of the asset
 * @property {string} symbol - Symbol of the asset
 * @property {number} percentage - Percentage of gain or loss
 */

/**
 * GET /api/assets/search/{value}
 * @summary Searching for an asset in the database default endpoint
 * @tags Asset
 * @param {string} value.path.required - The searched value (name or symbol)
 * @param {number} page.query - The page number to show (defaults to 1)
 * @param {number} limit.query - The limit number per page to show (defaults to 5)
 * @returns {AssetResponse} 200 - success
 * @example response - 200 - example success search
 * {
 * 	"assets": [
 * 		{
 *			"_id": "6215936867d12a1a4b20fd73",
 *  		"symbol": "btc",
 *  		"name": "bitcoin",
 *  		"searchedCount": 0
 * 		}
 * 	],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": 5
 * }
 * @example response - 200 - example empty response search
 * {
 * 	"assets": [],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": null
 * }
 * @returns {string} 500 - server error
 * @example response - 500 - example server error
 * {
 * 	"error": "Unable to fetch assets"
 * }
 */
router.get(`${paths.assets.search.db}:value`, pagination, async (req, res) => {
	try {
		const searchedValue = req.params.value
		const assets = await Asset.find({
			$or: [{ symbol: { $regex: searchedValue } }, { name: { $regex: searchedValue } }]
		})
			.sort({ searchedCount: -1 })
			.limit(req.limit)
			.skip(req.skipIndex)
			.exec()
		const count = await Asset.countDocuments({
			$or: [{ symbol: { $regex: searchedValue } }, { name: { $regex: searchedValue } }]
		}).exec()
		if (!assets) {
			throw new ServerError('Unable to fetch assets')
		}
		res.status(200).send({
			assets: assets,
			page: req.page,
			count: assets.length,
			max_page: Math.ceil(count / req.limit)
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/yahoo/search/{slug}
 * @summary Searching for an asset on yahoo default endpoint
 * @tags Asset
 * @param {string} slug.path.required - The searched slug
 * @returns {object} 200 - success
 * @example response - 200 - example success search
 * [
 *	{
 *      "currency": "USD",
 *      "regularMarketDayHigh": 99.1568,
 *      "regularMarketDayLow": 99.07,
 *      "regularMarketChange": -0.0374985,
 *      "regularMarketChangePercent": -0.0378209,
 *      "regularMarketPrice": 99.11,
 *      "regularMarketVolume": 2968,
 *      "averageDailyVolume3Month": 869,
 *      "averageDailyVolume10Day": 2418,
 *      "symbol": "BTC",
 *      "shortName": "ClearShares Piton Intermediate "
 *	}
 * ]
 * @returns {string} 500 - server error
 */
router.get(`${paths.assets.search.yahoo}:slug`, async (req, res) => {
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

		res.status(200).send(response)
	} catch (e) {
		res.status(500).send({
			error: e.message
		})
	}
})

/**
 * GET /api/assets
 * @summary All of the assets in the database default endpoint
 * @tags Asset
 * @param {number} page.query - The page number to show (defaults to 1)
 * @param {number} limit.query - The limit number per page to show (defaults to 5)
 * @returns {AssetResponse} 200 - success
 * @example response - 200 - example success response
 * {
 * 	"assets": [
 * 		{
 *			"_id": "6215936867d12a1a4b20fd73",
 *  		"symbol": "btc",
 *  		"name": "bitcoin",
 *  		"searchedCount": 0
 * 		}
 * 	],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": 5
 * }
 * @example response - 200 - example empty response
 * {
 * 	"assets": [],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": null
 * }
 * @returns {string} 500 - server error
 * @example response - 500 - example server error
 * {
 * 	"error": "Unable to fetch assets"
 * }
 */
router.get(paths.assets.all, pagination, async (req, res) => {
	try {
		const assets = await Asset.find().limit(req.limit).skip(req.skipIndex).exec()
		const count = await Asset.countDocuments().exec()
		if (!assets) {
			throw new ServerError('Unable to fetch assets')
		}
		res.status(200).send({
			assets: assets,
			page: req.page,
			count: assets.length,
			max_page: Math.ceil(count / req.limit)
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/assets/top/gainers
 * @summary Top gainers stored in the database default endpoint
 * @tags Asset
 * @param {number} page.query - The page number to show (defaults to 1)
 * @param {number} limit.query - The limit number per page to show (defaults to 5)
 * @returns {TopAssetResponse} 200 - success
 * @example response - 200 - example success response
 * {
 * 	"assets": [
 * 		{
 *			"_id": "62167ae4fe6c10e06f6b1250",
 *  		"symbol": "osmo",
 *  		"percentage": 11.19
 * 		}
 * 	],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": 5
 * }
 * @example response - 200 - example empty response
 * {
 * 	"assets": [],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": null
 * }
 * @returns {string} 500 - server error
 * @example response - 500 - example server error
 * {
 * 	"error": "Unable to fetch assets"
 * }
 */
router.get(paths.assets.top.gainers, pagination, async (req, res) => {
	try {
		await verifyTopAssets(options.gainers)
		const assets = await TopGainer.find().sort({ percentage: -1 }).limit(req.limit).skip(req.skipIndex).exec()
		const count = await TopGainer.countDocuments().exec()
		if (!assets || assets.length === 0) {
			throw new NotFoundHttpError('Unable to fetch assets')
		}
		res.status(200).send({
			assets: assets,
			page: req.page,
			count: assets.length,
			max_page: Math.ceil(count / req.limit)
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/assets/top/losers
 * @summary Top losers stored in the database default endpoint
 * @tags Asset
 * @param {number} page.query - The page number to show (defaults to 1)
 * @param {number} limit.query - The limit number per page to show (defaults to 5)
 * @returns {TopAssetResponse} 200 - success
 * @example response - 200 - example success response
 * {
 * 	"assets": [
 * 		{
 *			"_id": "62167b9a70dab428073078ec",
 *  		"symbol": "bit5",
 *  		"percentage": -1.15
 * 		}
 * 	],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": 5
 * }
 * @example response - 200 - example empty response
 * {
 * 	"assets": [],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": null
 * }
 * @returns {string} 500 - server error
 * @example response - 500 - example server error
 * {
 * 	"error": "Unable to fetch assets"
 * }
 */
router.get(paths.assets.top.loser, pagination, async (req, res) => {
	try {
		await verifyTopAssets(options.losers)
		const assets = await TopLoser.find().sort({ percentage: 1 }).limit(req.limit).skip(req.skipIndex).exec()
		const count = await TopLoser.countDocuments().exec()
		if (!assets || assets.length === 0) {
			throw new NotFoundHttpError('Unable to fetch assets')
		}
		res.status(200).send({
			assets: assets,
			page: req.page,
			count: assets.length,
			max_page: Math.ceil(count / req.limit)
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/assets/popular
 * @summary Popular assets in the database default endpoint (based on searchedCount)
 * @tags Asset
 * @param {number} page.query - The page number to show (defaults to 1)
 * @param {number} limit.query - The limit number per page to show (defaults to 5)
 * @returns {AssetResponse} 200 - success
 * @example response - 200 - example success response
 * {
 * 	"assets": [
 * 		{
 *			"_id": "6215936867d12a1a4b20fd73",
 *  		"symbol": "btc",
 *  		"name": "bitcoin",
 *  		"searchedCount": 10000
 * 		}
 * 	],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": 5
 * }
 * @example response - 200 - example empty response
 * {
 * 	"assets": [],
 * 	"page": 1,
 * 	"count": 1,
	"max_page": null
 * }
 * @returns {string} 500 - server error
 * @example response - 500 - example server error
 * {
 * 	"error": "Unable to fetch assets"
 * }
 */
router.get(paths.assets.populars, pagination, async (req, res) => {
	try {
		const assets = await Asset.find().sort({ searchedCount: -1 }).limit(req.limit).skip(req.skipIndex).exec()
		const count = await Asset.find().exec()
		if (!assets) {
			throw new ServerError('Unable to fetch assets')
		}
		res.status(200).send({
			assets: assets,
			page: req.page,
			count: assets.length,
			max_page: Math.ceil(count / req.limit)
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/yahoo/chart/{slug}
 * @summary Getting chart values for an asset on yahoo default endpoint
 * @tags Asset
 * @param {string} slug.path.required - The searched slug
 * @returns {object} 200 - success
 * @example response - 200 - example success response
 * [
 *  {
 *      "symbol": "btc",
 *      "response": [
 *          {
 *              "meta": {
 *                  "currency": "USD",
 *                  "symbol": "BTC",
 *                  "exchangeName": "PCX",
 *                  "instrumentType": "ETF",
 *                  "firstTradeDate": 1601559000,
 *                  "regularMarketTime": 1620674710,
 *                  "gmtoffset": -18000,
 *                  "timezone": "EST",
 *                  "exchangeTimezoneName": "America/New_York",
 *                  "regularMarketPrice": 99.11,
 *                  "chartPreviousClose": 99.1475,
 *                  "previousClose": 99.1475,
 *                  "scale": 4,
 *                  "priceHint": 2,
 *                  "currentTradingPeriod": {
 *                      "pre": {
 *                          "timezone": "EST",
 *                          "start": 1645606800,
 *                          "end": 1645626600,
 *                          "gmtoffset": -18000
 *                      },
 *                      "regular": {
 *                          "timezone": "EST",
 *                          "start": 1645626600,
 *                          "end": 1645650000,
 *                          "gmtoffset": -18000
 *                      },
 *                      "post": {
 *                          "timezone": "EST",
 *                          "start": 1645650000,
 *                          "end": 1645664400,
 *                          "gmtoffset": -18000
 *                      }
 *                  },
 *                  "dataGranularity": "1h",
 *                  "range": "1d",
 *                  "validRanges": [
 *                      "1d",
 *                      "5d",
 *                      "1mo",
 *                      "3mo",
 *                      "6mo",
 *                      "1y",
 *                      "2y",
 *                      "ytd",
 *                      "max"
 *                  ]
 *              },
 *              "indicators": {
 *                  "quote": [
 *                      {}
 *                  ]
 *              }
 *          }
 *      ]
 *	}
 *]
 * @returns {string} 500 - server error
 */
router.get(`${paths.assets.chart}:slug`, async (req, res) => {
	try {
		const response = await fetchSymbol(req.params.slug, {
			range: req.query.dateRange,
			interval: req.query.interval
		})
		res.send(response)
	} catch (e) {
		res.status(500).send({
			error: e.message
		})
	}
})

async function verifyTopAssets(option) {
	const isEmpty = await option.model.isEmpty(option.collection)
	if (isEmpty) await fetchTopAssets(option)
	else {
		let hasFiveMinutesPassed = await hasTimePassed(option.model, 5)
		if (hasFiveMinutesPassed) await modifyTopAssets(option)
	}
}

async function hasTimePassed(model, time) {
	const data = await model.findOne()
	let update = data.updatedAt.toISOString()
	update = update.substring(update.indexOf(':') + 1, update.indexOf(':') + 3)

	let date = new Date().toISOString()
	date = date.substring(date.indexOf(':') + 1, date.indexOf(':') + 3)

	const diff = Math.abs(parseInt(update) - parseInt(date))
	return diff >= time
}

module.exports = router
