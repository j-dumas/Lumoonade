const express = require('express')
const authentification = require('../middleware/auth')
const pagination = require('../middleware/pagination')
const validator = require('validator').default
require('../swagger_models')

const router = express.Router()

/**
 * GET /api/me
 * @summary Complete profile default endpoint
 * @tags Me
 * @return {UserResponse} 200 - success
 * @example response - 200 - example success response
 * {
 * 	"username": "Hubert Laliberté",
 * 	"email": "hubert_est_cool@gmail.com",
 *	"wallet_list": [
 *		{
 *			"owner": "6203eecd2dc7a9b0f269224f",
 *			"slug": "eth",
 *			"amount": 2
 *		},
 *		{
 *			"owner": "6203eecd2dc7a9b0f269224f",
 *			"slug": "btc",
 *			"amount": 4.5
 *		}
 *	],
 *	"favorite_list": [
 *		{
 *			"owner": "6203eecd2dc7a9b0f269224f",
 *			"slug": "62040654d34adb47567360c4"
 *		},
 *		{
 *			"owner": "6203eecd2dc7a9b0f269224f",
 *			"slug": "620407962e107274706bcb4e"
 *		},
 *		{
 *			"owner": "6203eecd2dc7a9b0f269224f",
 *			"slug": "6204079b698992cb681bf2d8"
 *		},
 *		{
 *			"owner": "6203eecd2dc7a9b0f269224f",
 *			"slug": "6204079e82494464d9f76cac"
 *		}
 *	],
 * 	"sessions": 1,
 * 	"watchlist_list": []
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @security BearerAuth
 */
router.get('/api/me', authentification, async (req, res) => {
	await req.user.populate({
		path: 'wallet',
	})
	await req.user.populate({
		path: 'favorite',
	})
	await req.user.populate({
		path: 'watchlist',
	})
	const profile = await req.user.makeProfile()
	profile.sessions = req.user.sessions.length
	profile.wallet_list = req.user.wallet
	profile.favorite_list = req.user.favorite
	profile.watchlist_list = req.user.watchlist
	res.send(profile)
})

/**
 * GET /api/me/profile
 * @summary Profile summary default endpoint
 * @tags Me
 * @return {UserSummaryResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *	"username": "Hubert Laliberté",
 *	"email": "hubert_est_cool@gmail.com",
 *	"wallet_list": 2,
 *	"favorite_list": 4,
 *	"sessions": 1,
 *	"watchlist_list": 0
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @security BearerAuth
 */
router.get('/api/me/profile', authentification, async (req, res) => {
	const profile = await req.user.makeProfile()
	res.send(profile)
})

/**
 * This is only used by '/api/me/update' to properly make all validations and checks
 * @param {json} body
 * @param {list} allowed
 * @returns list of fields to be modified
 */
const updateHelper = async (body, user) => {
	if (body.length === 0) {
		throw new Error({ message: 'Please provide informations to be modified' })
	}

	// what we want to keep for password modification
	const { oldPassword, newPassword, password } = body
	let response = {}

	if (password) {
		throw new Error('Cannot implicitly set a new password without proper validations')
	}

	if (oldPassword && newPassword) {
		const isOldPassword = await user.isOldPassword(oldPassword)
		if (isOldPassword) {
			response.password = newPassword
		} else {
			throw new Error('Invalid password. Cannot modify current password.')
		}
	}

	response.username = body.username
	return response
}

router.patch('/api/me/update', authentification, async (req, res) => {
	try {
		let updates = Object.keys(req.body)
		if (updates.length === 0) throw new Error('Please provide informations to be modified')

		const user = req.user
		const { oldPassword, newPassword, password } = req.body

		if (password) {
			throw new Error('Cannot implicitly set a new password without proper validations')
		}

		// validation if the old and new password are provided in the request body
		if (oldPassword && newPassword) {
			const isOldPassword = await user.isOldPassword(oldPassword)
			if (!isOldPassword) {
				throw new Error('Invalid password. Cannot modify current password.')
			}

			if (validator.isEmpty(newPassword.trim())) {
				throw new Error('Cannot assign an empty password')
			}
			delete req.body.oldPassword
			delete req.body.newPassword
			req.body.password = newPassword
			updates = Object.keys(req.body)
		}

		const allowed = ['username', 'password']
		const isValidPatch = updates.every((update) => allowed.includes(update))

		if (!isValidPatch) throw new Error('One or more properties are not supported.')

		updates.forEach((update) => (user[update] = req.body[update]))
		await user.save()
		const profile = await user.makeProfile()
		res.send({
			profile,
			message: 'Account updated!',
		})
	} catch (e) {
		res.status(400).send({
			message: e.message,
		})
	}
})

router.delete('/api/me/delete', authentification, async (req, res) => {
	try {
		await req.user.remove()
		res.send({
			message: 'Removing account',
			account: req.user,
		})
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/api/me/wallets', [authentification, pagination], async (req, res) => {
	await req.user.populate({
		path: 'wallet',
		options: {
			limit: res.limit,
			skip: res.skipIndex,
		},
	})
	res.send({ wallets: req.user.wallet, page: res.page, count: req.user.wallet.length })
})

router.get('/api/me/favorites', [authentification, pagination], async (req, res) => {
	await req.user.populate({
		path: 'favorite',
		options: {
			limit: res.limit,
			skip: res.skipIndex,
		},
	})
	res.send({ favorites: req.user.favorite, page: res.page, count: req.user.favorite.length })
})

router.get('/api/me/watchlists', [authentification, pagination], async (req, res) => {
	await req.user.populate({
		path: 'watchlist',
		options: {
			limit: res.limit,
			skip: res.skipIndex,
		},
	})
	res.send({ watchlists: req.user.watchlist, page: res.page, count: req.user.watchlist.length })
})

router.patch('/api/me/sessions/purge', authentification, async (req, res) => {
	try {
		let activeSessions = req.user.sessions.length
		req.user.sessions = req.user.sessions.find((session) => session.session === req.token)
		await req.user.save()
		res.send({
			message: `Successfully purged all other sessions!`,
			purged: activeSessions - req.user.sessions.length,
		})
	} catch (e) {
		res.send(500).send()
	}
})

module.exports = router
