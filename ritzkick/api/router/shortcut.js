const express = require('express')
const { NotFoundHttpError, BadRequestHttpError, ConflictHttpError, sendError } = require('../../utils/http_errors')
const Shortcut = require('../../db/model/shortcut')
const router = express.Router()

const paths = require('../routes.json')

router.get(`${paths.shortcut.redirect}:id`, async (req, res) => {
	try {
		const shortcut = await Shortcut.findOne({ _id: req.params.id })
		if (!shortcut) {
			throw new NotFoundHttpError()
		}
		const url = shortcut.url
		await handleShortcuts(shortcut)
		res.redirect(url)
	} catch (e) {
		res.redirect('/')
	}
})

/**
 * POST /api/redirects
 * @summary Creates a shorturl
 * @tags Redirect
 * @param {object} request.body.required - Shortcut info
 * @example request - example payload
 * {
 *  "url": "https://www.youtube.com/",
 *  "destroyable": "true"
 * }
 * @return {object} 200 - success
 * @example response - 200 - example success response (if there's a match)
 * {
 *  "url": "https://www.lumoonade.com/redirects/abc26197acdea7623"
 * }
 * @return {object} 201 - success
 * @example response - 201 - example success response
 * {
 *  "url": "https://www.lumoonade.com/redirects/abc26197acdea7623"
 * }
 * @return {string} 409 - Conflict
 * @example response - 409 - example error response
 * {
 * 	"error": "You cannot set visits"
 * }
 */
router.post(paths.shortcut.default, async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new BadRequestHttpError('Please provide a body.')
		}
		const baseURL = `https://${process.env.URL}:${process.env.PORT}${paths.shortcut.redirect}`
		const existsShort = await Shortcut.findOne({ url: req.body.url })
		if (existsShort) {
			return res.send({
				url: `${baseURL}${existsShort._id}`
			})
		}
		let shortUrlBody = {
			...req.body
		}
		if (shortUrlBody.visits) {
			throw new ConflictHttpError('You cannot set visits')
		}
		const shorturl = new Shortcut(shortUrlBody)
		await shorturl.save()
		const url = `${baseURL}${shorturl._id}`
		res.status(201).send({
			url
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * Remove or update the shortcut depending on how it was defined.
 * @param {Shortcut} shortcut
 */
const handleShortcuts = async (shortcut) => {
	shortcut.visits = parseInt(shortcut.visits) + 1
	if (shortcut.destroyable && shortcut.maxUse <= shortcut.visits) {
		return await Shortcut.findOneAndRemove({ _id: shortcut._id })
	}
	await shortcut.save()
}

module.exports = router
