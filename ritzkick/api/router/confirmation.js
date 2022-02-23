const express = require('express')
const router = express.Router()
const Confirmation = require('../../db/model/watchlist')
const { sendError, NotFoundHttpError } = require('../../utils/http_errors')
const auth = require('../middleware/auth')
const es = require('../../application/email/email-service')

const paths = require('../routes.json')

router.post(paths.alerts.create, auth, async (req, res) => {
	try {
		const user = req.user
		let queryData = {
			owner: user._id,
			...req.body
		}

		const { slug } = queryData

		const watchlist = new Watchlist(queryData)
		await watchlist.save()
		await req.user.addWatchlistAlertAndSave(watchlist)
		es.notifyAdd(slug)
		res.status(201).send(watchlist)
	} catch (e) {
		await sendError(res, e)
	}
})

router.get('/api/confirmation/verify/:jwt', auth, async (req, res) => {
    try {
		const token = req.params.jwt
		const decoded = jwt.verify(token, process.env.RESET_JWT_SECRET)
		const { email, secret } = decoded
		const reset = await Confirmation.findOne({ email, secret })
		if (!reset) {
			throw new Error('Token may be outdated.')
		}

		const decodedTokenStored = jwt.verify(reset.resetToken, process.env.RESET_JWT_SECRET)

		const modified = !Object.keys(decoded).every((key) => {
			return decoded[key] === decodedTokenStored[key]
		})

		if (modified) {
			throw new Error('Token is corrupted')
		}

		reset.attemps = parseInt(reset.attemps) + 1
		await reset.save()
		res.send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

module.exports = router
