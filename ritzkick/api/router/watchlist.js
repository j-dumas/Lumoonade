const express = require('express')
const mongoose = require('mongoose')
const Watchlist = require('../../db/model/watchlist')
const authentification = require('../middleware/auth')
const router = express.Router()
const HttpError = require('../http_error')
require('../swagger_models')

/**
 * Watchlist Creation Model
 * @typedef {object} WatchlistRequest
 * @property {string} slug.required - Slug of the Asset
 * @property {number} target.required - Target price to notify
 */

/**
 * POST /api/watchlist
 * @summary Creating a watchlist default endpoint
 * @tags Watchlist
 * @param {WatchlistRequest} request.body.required - Watchlist info
 * @example request - example payload
 * {
 * 	"slug": "eth",
 * 	"target": "5000"
 * }
 * @return {Watchlist} 201 - created
 * @example response - 201 - example watchlist created response
 * {
 * 	"owner": "62053ab027b05e6fe8e3939f",
 * 	"slug": "eth",
 * 	"target": 5000
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @return {string} 409 - already created
 * @example response - 409 - example already created watchlist error response
 *  {
 *	 "error": "Already created"
 *	}
 * @security BearerAuth
 */
router.post('/api/watchlist', authentification, async (req, res) => {
	try {
		let data = {
			owner: req.user._id,
			...req.body
		}
		const obj = Watchlist.findOne({
			owner: data.owner,
			slug: data.slug,
			target: data.target
		}).exec()
		if (obj) {
			throw new HttpError('Already created', 409)
		}
		const watchlist = new Watchlist(data)
		await watchlist.save()
		res.status(201).send(watchlist)
	} catch (e) {
		res.status(e.status).send({
			error: e.message
		})
	}
})

module.exports = router
