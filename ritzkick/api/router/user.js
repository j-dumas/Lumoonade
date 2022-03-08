const express = require('express')
const { BadRequestHttpError, ServerError, ConflictHttpError, sendError } = require('../../utils/http_errors')
const authentification = require('../middleware/auth')
const pagination = require('../middleware/pagination')
const validator = require('validator').default
require('../swagger_models')

const router = express.Router()

const paths = require('../routes.json')

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
router.get(paths.user.complete, authentification, async (req, res) => {
	await req.user.populate({
		path: 'wallet'
	})
	await req.user.populate({
		path: 'favorite'
	})
	await req.user.populate({
		path: 'watchlist'
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
router.get(paths.user.summary, authentification, async (req, res) => {
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
		throw new BadRequestHttpError({ message: 'Please provide informations to be modified' })
	}

	// what we want to keep for password modification
	const { oldPassword, newPassword, password } = body
	let response = {}

	if (password) {
		throw new ConflictHttpError('Cannot implicitly set a new password without proper validations')
	}

	if (oldPassword && newPassword) {
		const isOldPassword = await user.isOldPassword(oldPassword)
		if (isOldPassword) {
			response.password = newPassword
		} else {
			throw new ConflictHttpError('Invalid password. Cannot modify current password.')
		}
	}

	response.username = body.username
	return response
}

/**
 * PATCH /api/me/update
 * @summary Update the user's profile
 * @tags Me
 * @param {object} request.body.required - User info
 * @example request - example payload
 * {
 *  "oldPassword": "12345mdp,
 *  "newPassword": "123456mdp"
 * }
 * @return {UserSummaryResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *   "message": "Account updated!",
 * 	 "profile": {
 * 	 	...
 *    }
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @return {string} 400 - bad request
 * @example response - 400 - example of an error message
 * {
 * 	"message": "Please provide informations to be modified | Cannot implicitly set a new password without proper validations | Invalid password. Cannot modify current password | Cannot assign an empty password | One or more properties are not supported"
 * }
 * @security BearerAuth
 */
router.patch(paths.user.update, authentification, async (req, res) => {
	try {
		let updates = Object.keys(req.body)
		if (updates.length === 0) throw new BadRequestHttpError('Please provide informations to be modified')

		const user = req.user
		const { oldPassword, newPassword, password } = req.body

		if (password) {
			throw new ConflictHttpError('Cannot implicitly set a new password without proper validations')
		}

		// validation if the old and new password are provided in the request body
		if (oldPassword && newPassword) {
			const isOldPassword = await user.isOldPassword(oldPassword)
			if (!isOldPassword) {
				throw new ConflictHttpError('Invalid password. Cannot modify current password.')
			}

			if (validator.isEmpty(newPassword.trim())) {
				throw new BadRequestHttpError('Cannot assign an empty password')
			}
			delete req.body.oldPassword
			delete req.body.newPassword
			req.body.password = newPassword
			updates = Object.keys(req.body)
		}

		const allowed = ['username', 'password']
		const isValidPatch = updates.every((update) => allowed.includes(update))

		if (!isValidPatch) throw new ConflictHttpError('One or more properties are not supported.')

		updates.forEach((update) => (user[update] = req.body[update]))
		await user.save()
		const profile = await user.makeProfile()
		res.send({
			profile,
			message: 'Account updated!'
		})
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * DELETE /api/me/delete
 * @summary Get all wallets from the user
 * @tags Me
 * @return {UserSummaryResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *   "message": "Removing account",
 * 	 "account": {
 * 	 	...
 *    }
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @return {string} 500 - server error
 * @security BearerAuth
 */
router.delete(paths.user.delete, authentification, async (req, res) => {
	try {
		await req.user.remove()
		res.send({
			message: 'Removing account',
			account: req.user
		})
	} catch (e) {
		res.status(500).send()
	}
})

/**
 * GET /api/me/wallets
 * @summary Get all wallets from the user
 * @tags Me
 * @return {UserSummaryResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *   "wallets": [
 *       {
 *           "_id": "62263541b4d46876e9313238",
 *           "owner": "622634deb4d46876e931322f",
 *           "asset": "btc",
 *           "amount": 22,
 *           "history": [
 *               {
 *                   "transaction": "62263562b4d46876e9313241",
 *                   "_id": "62263562b4d46876e9313243"
 *               }
 *           ],
 *           "createdAt": "2022-03-07T16:39:29.385Z",
 *           "updatedAt": "2022-03-07T16:40:02.419Z",
 *           "__v": 1
 *       }
 *   ],
 *   "page": 1,
 *   "count": 1
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @security BearerAuth
 */
router.get('/api/me/wallets', [authentification, pagination], async (req, res) => {
	await req.user.populate({
		path: 'wallet',
		options: {
			limit: req.limit,
			skip: req.skipIndex
		}
	})
	res.send({ wallets: req.user.wallet, page: req.page, count: req.user.wallet.length })
})

/**
 * GET /api/me/favorites
 * @summary Get all of the favorite assets from the user
 * @tags Me
 * @return {UserSummaryResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *   "favorites": [
 *       {
 *           "_id": "622655ba179310aac5ce1599",
 *           "owner": "622634deb4d46876e931322f",
 *           "slug": "ada"
 *       }
 *   ],
 *   "page": 1,
 *   "count": 1
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @security BearerAuth
 */
router.get(paths.favorites.all, [authentification, pagination], async (req, res) => {
	await req.user.populate({
		path: 'favorite',
		options: {
			limit: req.limit,
			skip: req.skipIndex
		}
	})
	res.send({ favorites: req.user.favorite, page: req.page, count: req.user.favorite.length })
})

/**
 * GET /api/me/watchlists
 * @summary Get all of the user's alerts
 * @tags Me
 * @return {UserSummaryResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *   "watchlists": [
 *       {
 *           "_id": "622655ba179310aac5ce1599",
 *           "owner": "622634deb4d46876e931322f",
 *           "slug": "ada-cad",
 *           "parameter": "gte",
 *           "target": 2000,
 *           "createdAt": "2022-03-07T18:58:02.422Z",
 *           "updatedAt": "2022-03-07T18:58:02.422Z",
 *           "__v": 0
 *       }
 *   ],
 *   "page": 1,
 *   "count": 1
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @security BearerAuth
 */
router.get(paths.alerts.all, [authentification, pagination], async (req, res) => {
	await req.user.populate({
		path: 'watchlist',
		options: {
			limit: req.limit,
			skip: req.skipIndex
		}
	})
	res.send({ watchlists: req.user.watchlist, page: req.page, count: req.user.watchlist.length })
})

/**
 * PATCH /api/me/sessions/purge
 * @summary Purge all other sessions
 * @tags Me
 * @return {UserSummaryResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *	"message": "Successfully purged all other sessions!",
 * 	"purged": 1
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @return {string} 500 - server error
 * @security BearerAuth
 */
router.patch('/api/me/sessions/purge', authentification, async (req, res) => {
	try {
		let activeSessions = req.user.sessions.length
		req.user.sessions = req.user.sessions.find((session) => session.session === req.token)
		await req.user.save()
		res.send({
			message: `Successfully purged all other sessions!`,
			purged: activeSessions - req.user.sessions.length
		})
	} catch (e) {
		res.send(500).send()
	}
})

module.exports = router
