const express = require('express')
const mongoose = require('mongoose')
const Asset = require('../../db/model/asset')
const Crypto = require('../../db/model/crypto')
const crypto = require('../../application/crypto/crypto')
const router = express.Router()

router.get('/api/crypto/all', async (req, res) => {
	try {
		// Api calls are going to be fetched from the DB
		// Not the case right now, but this is for development purpuses
		const btc = await crypto.getPrice(crypto.btc_contacts)
		const eth = await crypto.getPrice(crypto.eth_contacts)
		res.send({
			btc,
			eth
		})
	} catch (e) {
		res.status(400).send({
			error: e.message
		})
	}
})

module.exports = router
