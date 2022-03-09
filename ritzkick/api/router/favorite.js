const express = require('express')
const Favorite = require('../../db/model/favorite')
const authentification = require('../middleware/auth')
const router = express.Router()
const { ConflictHttpError, sendError } = require('../../utils/http_errors')
require('../swagger_models')

const paths = require('../routes.json')

/**
 * Favorite Request Model
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
router.post(paths.favorites.default, authentification, async (req, res) => {
	try {
		let data = {
			owner: req.user._id,
			...req.body
		}
		const obj = await Favorite.findOne({ owner: data.owner, slug: data.slug }).exec()
		if (obj) throw new ConflictHttpError()
		const favorite = new Favorite(data)
		await favorite.save()
		await req.user.addFavoriteAndSave(favorite._id)
		res.status(201).send(favorite)
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * DELETE /api/favorite
 * @summary Deleting a favorite default endpoint
 * @tags Favorite
 * @param {FavoriteRequest} request.body.required - Favorite info
 * @example request - example payload
 * {
 * 	"slug": "eth"
 * }
 * @return {object} 204 - deleted
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @return {string} 404 - not found
 * @example response - 404 - example not found favorite error response
 *  {
 *	 "error": "Not Found"
 *	}
 * @security BearerAuth
 */
router.delete(paths.favorites.default, authentification, async (req, res) => {
	try {
		let filter = {
			owner: req.user._id,
			...req.body
		}
		const obj = await Favorite.findOne(filter).exec()
		if (!obj) {
			return res.status(404).send()
		}
		let favorite = await Favorite.findOneAndDelete(filter)
		await req.user.removeFavoriteAndSave(favorite._id)
		res.status(204).send()
	} catch (e) {
		res.status(400).send()
	}
})

module.exports = router
