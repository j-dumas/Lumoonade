const express = require('express')
const Wallet = require('../../db/model/wallet')
const Transaction = require('../../db/model/transaction')
const auth = require('../middleware/auth')
const { NotFoundHttpError, ConflictHttpError, BadRequestHttpError, sendError } = require('../../utils/http_errors')
const router = express.Router()
const { Asset } = require('../../db/model/asset')
require('../swagger_models')

/**
 * Transaction Model
 * @typedef {object} Transaction
 * @property {string} asset - Name of the asset
 * @property {string} when - Date of the purchase
 * @property {number} paid - Amount that you spent
 * @property {number} boughtAt - Amount that the asset was
 */

/**
 * POST /api/wallet/{name}/add
 * @summary Create a transaction in the user's wallet
 * @tags Wallet
 * @param {Transaction} request.body.required - Transaction details
 * @example request - example payload
 * {
 * 	"asset": "btc",
 * 	"when": "2022-02-22",
 * 	"paid": 300,
 * 	"boughtAt": 50000
 * }
 * @return 201 - created
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "You don't have a wallet with the name 'btc'"
 * }
 * @security BearerAuth
 */
router.post('/api/wallet/:name/add', auth, async (req, res) => {
	try {
		const asset = req.params.name
		const wallet = await Wallet.findOne({ owner: req.user._id, asset })
		if (!wallet) {
			throw new NotFoundHttpError(`You don't have a wallet with the name '${asset}'`)
		}
		const content = {
			owner: req.user._id,
			wallet: wallet._id,
			asset,
			...req.body
		}
		const transac = new Transaction(content)
		try {
			await transac.save()
		} catch (e) {
			throw new BadRequestHttpError(e.message)
		}
		await wallet.appendTransaction(transac)
		res.status(201).send()
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * DELETE /api/wallet/{name}/remove
 * @summary Remove a transaction in the user's wallet
 * @tags Wallet
 * @param {object} request.body.required - id of the transaction
 * @example request - example payload
 * {
 * 	"id": "abc9201ca9281caa112"
 * }
 * @return 200 - removed!
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "You don't have a wallet with the name 'btc' | Could not delete the transaction history"
 * }
 * @security BearerAuth
 */
router.delete('/api/wallet/:name/remove', auth, async (req, res) => {
	try {
		const asset = req.params.name
		const wallet = await Wallet.findOne({ owner: req.user._id, asset })
		if (!wallet) {
			throw new NotFoundHttpError(`You don't have a wallet with the name '${asset}'`)
		}
		const { id } = req.body
		const transac = await Transaction.findOneAndDelete({ _id: id, owner: req.user._id, wallet: wallet._id, asset })
		if (!transac) {
			throw new BadRequestHttpError('Could not delete the transaction history')
		}
		await wallet.removeTransaction(transac)
		res.status(200).send()
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/wallet/{name}/content
 * @summary View all transactions in a user's specific wallet
 * @tags Wallet
 * @return {list} 200 - all transactions of the wallet
 * @example response - 200 - example of a possible response message
 * 	[
 * 	  {
 * 	  	"owner": "aa42bc173aaca",
 * 		"wallet": "ba42bc173aaca",
 * 		"asset": "btc",
 * 		"when": "2022-02-22",
 * 		"paid": 300,
 * 		"boughtAt": 50000,
 * 		"amount": 0.006
 * 	  }
 * 	]
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "You don't have a wallet with the name 'btc'"
 * }
 * @security BearerAuth
 */
router.get('/api/wallet/:name/content', auth, async (req, res) => {
	try {
		const asset = req.params.name
		const wallet = await Wallet.findOne({ owner: req.user._id, asset })
		if (!wallet) {
			throw new NotFoundHttpError(`You don't have a wallet with the name '${asset}'`)
		}
		await wallet.populate({
			path: 'hist'
		})
		res.status(200).send(wallet.hist)
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/wallets/transactions
 * @summary View all transactions of all wallets of the user
 * @tags Wallet
 * @return {list} 200 - all transactions of the wallet
 * @example response - 200 - example of a possible response message
 * 	[
 * 	  {
 * 	  	"owner": "aa42bc173aaca",
 * 		"wallet": "ba42bc173aaca",
 * 		"asset": "btc",
 * 		"when": "2022-02-22",
 * 		"paid": 300,
 * 		"boughtAt": 50000,
 * 		"amount": 0.006
 * 	  },
 * 	  {
 * 	  	"owner": "aa42bc173aaca",
 * 		"wallet": "ca42bc173aaca",
 * 		"asset": "eth",
 * 		"when": "2022-02-22",
 * 		"paid": 300,
 * 		"boughtAt": 5000,
 * 		"amount": 0.06
 * 	  }
 * 	]
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "You don't have any wallet"
 * }
 * @security BearerAuth
 */
router.get('/api/wallets/transactions', auth, async (req, res) => {
	try {
		const wallets = await Wallet.find({ owner: req.user._id })
		if (wallets.length === 0) {
			throw new NotFoundHttpError(`You don't have any wallet.`)
		}
		for (let i = 0; i < wallets.length; i++) {
			await wallets[i].populate({
				path: 'hist'
			})
		}

		let transactions = []
		wallets.forEach((wallet) => {
			transactions.push(wallet.hist)
		})

		res.send(transactions.flat())
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * GET /api/wallets/detailed
 * @summary View all transactions of all wallets of the user in more details
 * @tags Wallet
 * @return {object} 200 - all transactions of the wallet
 * @example response - 200 - example of a possible response message
 * {
 *	"assets": [{
 *			"name": "btc",
 *			"totalSpent": 20,
 *			"averageSpent": 20,
 *			"amount": 0.4,
 *			"transactions": 1,
 *			"percentInPortfolio": 100
 *		}],
 *		"assetCount": 1,
 *		"totalSpent": 20,
 *		"coverage": 100
 *	}
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "You don't have any wallet"
 * }
 * @security BearerAuth
 */
router.get('/api/wallets/detailed', auth, async (req, res) => {
	try {
		const wallets = await Wallet.find({ owner: req.user._id })
		if (wallets.length === 0) {
			throw new NotFoundHttpError(`You don't have any wallet.`)
		}

		for (let i = 0; i < wallets.length; i++) {
			await wallets[i].populate({
				path: 'hist'
			})
		}
		const result = {
			assets: []
		}
		let totalSpent = 0

		// Possible optimization here.
		wallets.forEach((wallet) => {
			let spent = 0
			let hold = 0
			let avg = 0
			// Over here.
			wallet.hist.forEach((history) => {
				totalSpent += history.paid
				if (history.paid >= 0) {
					spent += history.paid
				}
				hold += history.amount
				avg++
			})
			avg = spent / avg
			result.assets.push({
				name: wallet.asset,
				totalSpent: spent,
				averageSpent: avg || 0,
				amount: hold,
				transactions: wallet.hist.length
			})
		})

		let coverage = 0
		Object.keys(result.assets).forEach((res) => {
			result.assets[res].percentInPortfolio = (result.assets[res].totalSpent / totalSpent) * 100 || 0
			coverage += result.assets[res].percentInPortfolio
		})

		result.assetCount = Object.keys(result).length
		result.totalSpent = totalSpent
		result.coverage = coverage || 0

		res.send(result)
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * POST /api/wallets
 * @summary Create a wallet for the user
 * @tags Wallet
 * @param {Wallet} request.body.required - Wallet
 * @example request - example payload
 * {
 * 	"asset": "btc",
 * 	"amount": 0
 * }
 * @return {object} 201 - all transactions of the wallet
 * @example response - 201 - example of a possible response message
 * {
 *   "message": "Wallet Created!",
 *   "wallet": {
 *       "owner": "aa42bc173aaca",
 *       "asset": "btc",
 *       "amount": 0,
 *       "_id": "aa42bc173aabb",
 *       "history": [],
 *       "createdAt": "2022-03-07T16:39:29.385Z",
 *       "updatedAt": "2022-03-07T16:39:29.385Z",
 *      "__v": 0
 *  }
 *}
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "This wallet is already defined"
 * }
 * @security BearerAuth
 */
router.post('/api/wallets', auth, async (req, res) => {
	try {
		const userId = req.user._id
		let body = {
			owner: userId,
			...req.body
		}
		const exists = await Wallet.findOne({ owner: userId, asset: req.body.asset })
		if (exists) {
			throw new ConflictHttpError('This wallet is already defined.')
		}

		const asset = await Asset.findOne({ symbol: req.body.asset })
		if (!asset) {
			throw new Error('Cannot create a wallet with an invalid asset name')
		}

		const wallet = new Wallet(body)
		try {
			await wallet.save()
		} catch (e) {
			throw new BadRequestHttpError(e.message)
		}
		await req.user.addWalletAndSave(wallet)
		res.status(201).send({
			message: 'Wallet Created!',
			wallet
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * PUT /api/wallets/update
 * @summary Modification of the user's wallet
 * @tags Wallet
 * @param {Wallet} request.body.required - Wallet
 * @example request - example payload
 * {
 * 	"asset": "btc",
 * 	"amount": 22
 * }
 * @return {object} 200 - modification of the wallet
 * @example response - 200 - example of a possible response message
 * {
 *   "message": "Successfully modified.",
 *   "wallet": {
 *       "owner": "aa42bc173aaca",
 *       "asset": "btc",
 *       "amount": 22,
 *       "_id": "aa42bc173aabb",
 *       "history": [],
 *       "createdAt": "2022-03-07T16:39:29.385Z",
 *       "updatedAt": "2022-03-07T16:39:29.385Z",
 *      "__v": 0
 *  }
 *}
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "Please provide a body | Please provide the necessary fields | Wallet does not exist"
 * }
 * @security BearerAuth
 */
router.put('/api/wallets/update', auth, async (req, res) => {
	try {
		const user = req.user
		let modification = Object.keys(req.body)
		if (modification.length === 0) {
			throw new BadRequestHttpError('Please provide a body.')
		}

		const { asset, amount } = req.body
		if (!asset || !amount) {
			throw new BadRequestHttpError('Please provide all necessary data.')
		}
		delete req.body.asset
		modification = Object.keys(req.body)
		const allowed = ['amount']
		const validModification = modification.every((mod) => allowed.includes(mod))
		if (!validModification) {
			throw new BadRequestHttpError('Please provide the necessary fields.')
		}

		const wallet = await Wallet.findOne({
			owner: user._id,
			asset
		})

		if (!wallet) {
			throw new NotFoundHttpError('Wallet does not exist.')
		}

		modification.forEach((element) => {
			wallet[element] = req.body[element]
		})

		await wallet.save()

		res.send({
			message: 'Successfully modified.',
			wallet
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * DELETE /api/wallets/delete
 * @summary Delete a wallet for the user
 * @tags Wallet
 * @param {object} request.body.required - Wallet
 * @example request - example payload
 * {
 * 	"asset": "btc"
 * }
 * @return {object} 204 - deleted
 * @example response - 201 - example of a possible response message
 * {
 *   "message": "Successfully deleted.",
 *   "wallet": {
 *       "owner": "aa42bc173aaca",
 *       "asset": "btc",
 *       "amount": 22,
 *       "_id": "aa42bc173aabb",
 *       "history": [],
 *       "createdAt": "2022-03-07T16:39:29.385Z",
 *       "updatedAt": "2022-03-07T16:39:29.385Z",
 *      "__v": 0
 *  }
 *}
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "Please provide an asset name | Unable to find a wallet for that name"
 * }
 * @security BearerAuth
 */
router.delete('/api/wallets/delete', auth, async (req, res) => {
	try {
		const { asset } = req.body
		if (!asset) {
			throw new BadRequestHttpError('Please provide an asset name.')
		}
		const wallet = await Wallet.findOneAndDelete({ asset, owner: req.user._id })

		if (!wallet) {
			throw new NotFoundHttpError('Unable to find a wallet for that name.')
		}

		await req.user.removeWalletAndSave(wallet._id)

		res.status(204).send({
			message: 'Successfully deleted.',
			wallet
		})
	} catch (e) {
		sendError(res, e)
	}
})

module.exports = router
