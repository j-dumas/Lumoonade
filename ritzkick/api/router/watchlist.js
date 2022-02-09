const express = require('express')
const mongoose = require('mongoose')
const Watchlist = require('../../db/model/watchlist')
const authentification = require('../middleware/auth')
const router = express.Router()

router.post('/api/watchlist', authentification, async (req, res) => {
	try {
		let data = {
			owner: req.user._id,
			...req.body,
		}
		const watchlist = new Watchlist(data)
		await watchlist.save()
		res.send(watchlist)
	} catch (e) {
		res.status(400).send({
			error: e.message,
		})
	}
})

module.exports = router
