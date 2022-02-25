const express = require('express')
const Wallet = require('../../db/model/wallet')
const Transaction = require('../../db/model/transaction')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/api/wallet/:name/add', auth, async (req, res) => {
	try {
		const asset = req.params.name
		const wallet = await Wallet.findOne({ owner: req.user._id, asset })
		if (!wallet) {
			throw new Error(`You don't have a wallet with the name '${asset}'`)
		}
		const content = {
			owner: req.user._id,
			wallet: wallet._id,
			asset,
			...req.body
		}
		const transac = new Transaction(content)
		await transac.save()
		await wallet.appendTransaction(transac)
		res.status(201).send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

router.delete('/api/wallet/:name/remove', auth, async (req, res) => {
	try {
		const asset = req.params.name
		const wallet = await Wallet.findOne({ owner: req.user._id, asset })
		if (!wallet) {
			throw new Error(`You don't have a wallet with the name '${asset}'`)
		}
		const { id } = req.body
		const transac = await Transaction.findOneAndDelete({ _id: id, owner: req.user._id, wallet: wallet._id, asset })
		if (!transac) {
			throw new Error('Could not delete the transaction history')
		}
		await wallet.removeTransaction(transac)
		res.status(200).send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

router.get('/api/wallet/:name/content', auth, async (req, res) => {
	try {
		const asset = req.params.name
		const wallet = await Wallet.findOne({ owner: req.user._id, asset })
		if (!wallet) {
			throw new Error(`You don't have a wallet with the name '${asset}'`)
		}
		await wallet.populate({
			path: 'hist'
		})
		res.status(200).send(wallet.hist)
	} catch (_) {
		res.status(400).send()
	}
})

router.post('/api/wallets', auth, async (req, res) => {
	try {
		const userId = req.user._id
		let body = {
			owner: userId,
			...req.body
		}
		const exists = await Wallet.findOne({ owner: userId, asset: req.body.asset })
		if (exists) {
			throw new Error('This wallet is already defined.')
		}
		const wallet = new Wallet(body)
		await wallet.save()
		await req.user.addWalletAndSave(wallet)
		res.status(201).send({
			message: 'Wallet Created!',
			wallet
		})
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

router.put('/api/wallets/update', auth, async (req, res) => {
	try {
		const user = req.user
		let modification = Object.keys(req.body)
		if (modification.length === 0) {
			throw new Error('Please provide a body.')
		}

		const { asset, amount } = req.body
		if (!asset || !amount) {
			throw new Error('Please provide all necessary data.')
		}
		delete req.body.asset
		modification = Object.keys(req.body)
		const allowed = ['amount']
		const validModification = modification.every(mod => allowed.includes(mod))
		if (!validModification) {
			throw new Error('Please provide the necessary fields.')
		}
		
		const wallet = await Wallet.findOne({
			owner: user._id,
			asset
		})

		if (!wallet) {
			throw new Error('Wallet does not exist.')
		}

		modification.forEach(element => {
			wallet[element] = req.body[element]
		})
		
		await wallet.save()

		res.send({
			message: 'Successfully modified.',
			wallet
		})
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

router.delete('/api/wallets/delete', auth, async (req, res) => {
	try {
		const { asset } = req.body
		if (!asset) {
			throw new Error('Please provide an asset name.')
		}
		const wallet = await Wallet.findOneAndDelete({ asset, owner: req.user._id })

		if (!wallet) {
			throw new Error('Unable to find a wallet for that name.')
		}
		
		await req.user.removeWalletAndSave(wallet._id)
		
		res.status(204).send({
			message: 'Successfully deleted.',
			wallet
		})
	} catch (e) {
		res.status(400).send()
	}
})

module.exports = router
