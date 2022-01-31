const express = require('express')
const mongoose = require('mongoose')
const Asset = require('../../db/model/asset')
const router = express.Router()

router.get('/api/assets', async (req, res) => {
	try {
		const assets = await Asset.find({})
		if (!assets || assets.length === 0) {
			throw new Error('Unable to find assets.')
		}

		res.send(assets)
	} catch (e) {
		res.status(500).send({
			message: e.message,
		})
	}
})

module.exports = router
