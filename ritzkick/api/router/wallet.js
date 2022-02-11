const express = require('express')
const Wallet = require('../../db/model/wallet')
const router = express.Router()

router.get('/api/wallets', async (req, res) => {
	try {
		const wallets = await Wallet.find({})
		if (!wallets || wallets.length === 0) {
			throw new Error('Unable to find wallets.')
		}

		res.send(wallets)
	} catch (e) {
		res.status(500).send({
			message: e.message
		})
	}
})

module.exports = router
