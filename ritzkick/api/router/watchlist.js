const express = require('express')
const mongoose = require('mongoose')
const Watchlist = require('../../db/model/watchlist')
const router = express.Router()

router.get('/api/watchlists', async (req, res) => {
	try {
		const watchlists = await Watchlist.find({})
		if (!watchlists || watchlists.length === 0) {
			throw new Error('Unable to find watchlists.')
		}

		res.send(watchlists)
	} catch (e) {
		res.status(500).send({
			message: e.message,
		})
	}
})

module.exports = router
