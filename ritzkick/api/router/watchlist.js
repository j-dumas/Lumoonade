const express = require('express')
const mongoose = require('mongoose')
const Watchlist = require('../../db/model/watchlist')
const authentification = require('../middleware/auth')
const router = express.Router()
const HttpError = require('../http_error')

router.post('/api/watchlist', authentification, async (req, res) => {
	try {
		let data = {
			owner: req.user._id,
			...req.body,
		}
		const obj = Watchlist.findOne({ slug: req.body.slug, target: req.body.target })
		if (obj) {
			throw new HttpError('Already created', 409)
		}
		const watchlist = new Watchlist(data)
		await watchlist.save()
		res.status(201).send(watchlist)
	} catch (e) {
		res.status(e.status).send({
			error: e.message,
		})
	}
})

module.exports = router
