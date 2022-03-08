const express = require('express')
const router = express.Router()
const Watchlist = require('../../db/model/watchlist')
const { sendError, NotFoundHttpError, BadRequestHttpError, ServerError } = require('../../utils/http_errors')
const auth = require('../middleware/auth')
const es = require('../../app/email/email-service')

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
		sendError(res, e)
	}
})

router.put(paths.alerts.update, auth, async (req, res) => {
	try {
		let updates = Object.keys(req.body)
		if (updates.length === 0) throw new BadRequestHttpError('Please provide informations to modify')
		const user = req.user
		const { id } = req.body
		const alert = await Watchlist.findOne({ _id: id, owner: user._id.toString() })
		if (!alert) {
			throw new NotFoundHttpError('Could not find the alert to modify')
		}

		updates = updates.filter((update) => update !== 'id')
		const allowed = ['parameter', 'target']
		const validUpdate = updates.every((update) => allowed.includes(update))
		if (!validUpdate) throw new BadRequestHttpError('One or more properties are not supported.')

		updates.forEach((update) => {
			if (update.toLowerCase().includes('parameter')) {
				let validModification = ['lte', 'gte']
				let content = req.body[update].toLowerCase()
				let found = validModification.find((modification) => modification === content)
				if (!found) {
					throw new BadRequestHttpError('Possible values are ' + validModification)
				}
			}

			alert[update] = req.body[update]
		})
		try {
			await alert.save()
		} catch (e) {
			throw new BadRequestHttpError(e.message)
		}

		res.send({
			message: 'Alert updated!',
			alert
		})
	} catch (e) {
		sendError(res, e)
	}
})

router.delete(paths.alerts.delete, auth, async (req, res) => {
	try {
		await req.user.populate({
			path: 'watchlist'
		})

		const alertId = req.body.id
		const exists = req.user.watchlist.find((w) => {
			return w._id.toString() === alertId
		})

		if (!exists) {
			throw new NotFoundHttpError('Could not find the alert')
		}

		const alert = await Watchlist.findOneAndRemove({ _id: req.body.id, owner: req.user._id.toString() })

		if (!alert) {
			throw new NotFoundHttpError('The alert seems to be already removed.')
		}

		await req.user.removeWatchlistAlertAndSave(alert._id)
		es.notifyRemove()
		res.send({
			message: 'Alert successfully removed.',
			alert
		})
	} catch (e) {
		sendError(res, e)
	}
})

module.exports = router
