const express = require('express')
const mongoose = require('mongoose')
const Favorite = require('../../db/model/favorite')
const authentification = require('../middleware/auth')
const router = express.Router()
const HttpError = require('../http_error')
require('../swagger_models')

/**
 * Favorite Creation Model
 * @typedef {object} FavoriteRequest
 * @property {string} slug.required - Slug of the Asset
 */

/**
 * POST /api/favorite
 * @summary Creating a favorite default endpoint
 * @tags Favorite
 * @param {FavoriteRequest} request.body.required - Favorite info
 * @example request - example payload
 * {
 * 	"slug": "eth"
 * }
 * @return {Favorite} 201 - created
 * @example response - 201 - example favorite created response
 * {
 * 	"owner": "62053ab027b05e6fe8e3939f",
 * 	"slug": "eth"
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @return {string} 409 - already created
 * @example response - 409 - example already created favorite error response
 *  {
 *	 "error": "Already created"
 *	}
 * @security BearerAuth
 */
router.post('/api/favorite', authentification, async (req, res) => {
	try {
		let data = {
			owner: req.user._id,
			...req.body,
		}
		const obj = await Favorite.findOne({ owner: data.owner, slug: data.slug }).exec()
		if (obj) {
			throw new HttpError('Already created', 409)
		}
		const favorite = new Favorite(data)
		await favorite.save()
		res.status(201).send(favorite)
	} catch (e) {
		res.status(e.status).send({
			error: e.message,
		})
	}
})

module.exports = router
