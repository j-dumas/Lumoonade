const express = require('express')
const User = require('../../db/model/user')
const authentication = require('../middleware/auth')
const router = express.Router()

/**
 * Login Request User Model
 * @typedef {object} LoginRequest
 * @property {string} email.required - Email
 * @property {string} password.required - Password
 */

/**
 * Register Request User Model
 * @typedef {object} RegisterRequest
 * @property {string} username.required - Username
 * @property {string} email.required - Email
 * @property {string} password.required - Password
 */

/**
 * Login/Register Response User Model
 * @typedef {object} UserResponse
 * @property {string} username.required - Username
 * @property {string} email.required - Email
 * @property {number} wallet_list - Length of the list of wallets
 * @property {number} favorite_list - Length of the list of favorite currencies
 * @property {number} sessions - Number of sessions open
 * @property {number} watchlist_list - Length of the watchlist
 */

/**
 * Login/Register Response Object
 * @typedef {object} LoginRegisterResponse
 * @property {UserResponse} user - User
 * @property {string} token - JWT
 */

/**
 * POST /api/auth/login
 * @summary The default endpoint for authentification
 * @tags Authentification
 * @param {LoginRequest} request.body.required - User info
 * @example request - example payload
 * {
 *  "email": "hubert_est_cool@gmail.com",
 *  "password": "12345mdp"
 * }
 * @return {LoginRegisterResponse} 200 - success
 * @example response - 200 - example success response
 * {
 *  "user": {
 *      "username": "Hubert Laliberté",
 *      "email": "hubert_est_cool@gmail.com",
 *      "wallet_list": 2,
 *      "favorite_list": 4,
 *      "sessions": 1,
 *      "watchlist_list": 0
 *  },
 *  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIn0.ngHSVeECwqZVeixvIifYbOLKQJTTvPPRNr0wRIOZdio"
 * }
 * @return {string} 400 - bad request
 * @example response - 400 - example error response
 * {
 * 	"error": "Could not login properly."
 * }
 */
router.post('/api/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findByCredentials(email, password)
		const token = await user.makeAuthToken()
		const profile = await user.makeProfile()
		res.send({
			user: profile,
			token,
		})
	} catch (e) {
		res.status(400).send({
			error: e.message,
		})
	}
})

/**
 * POST /api/auth/register
 * @summary The default endpoint for account creation
 * @tags Authentification
 * @param {RegisterRequest} request.body.required - User info
 * @example request - example payload
 * {
 * 	"username": "Hubert Laliberté",
 *  "email": "hubert_est_cool@gmail.com",
 *  "password": "12345mdp"
 * }
 * @return {LoginRegisterResponse} 201 - created
 * @example response - 201 - example created response
 * {
 *  "user": {
 *      "username": "Hubert Laliberté",
 *      "email": "hubert_est_cool@gmail.com",
 *      "wallet_list": 2,
 *      "favorite_list": 4,
 *      "sessions": 1,
 *      "watchlist_list": 0
 *  },
 *  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIn0.ngHSVeECwqZVeixvIifYbOLKQJTTvPPRNr0wRIOZdio"
 * }
 * @return {string} 400 - bad request
 * @example response - 400 - example password error response
 * {
 *	"error": "User validation failed: password: Path `password` (`1234mdp`) is shorter than the minimum allowed length (8)."
 * }
 * @example response - 400 - example existing user error response
 * {
 * 	"error": "E11000 duplicate key error collection: cryptool.users index: email_1 dup key: { email: \"hubert_est_cool@gmail.com\" }"
 * }
 */
router.post('/api/auth/register', async (req, res) => {
	try {
		const user = new User(req.body)
		await user.save()
		const token = await user.makeAuthToken()
		const profile = await user.makeProfile()
		res.status(201).send({
			user: profile,
			token,
		})
	} catch (e) {
		res.status(400).send({
			error: e.message,
		})
	}
})

/**
 * POST /api/auth/logout
 * @summary The default endpoint for logout purpuses
 * @tags Authentification
 * @return {object} 200 - success
 * @example response - 200 - example logout response
 * {
 * 	"message": "Succesfully logout!"
 * }
 * @return {string} 401 - unauthorized
 * @example response - 401 - example unauthenticated user error response
 * {
 * 	"error": "Please authenticate first."
 * }
 * @security BearerAuth
 */
router.post('/api/auth/logout', authentication, async (req, res) => {
	try {
		req.user.sessions = req.user.sessions.filter((session) => session.session !== req.token)
		await req.user.save()
		res.send({
			message: 'Succesfully logout!',
		})
	} catch (e) {
		res.status(401).send()
	}
})

/**
 * POST /api/auth/forgot
 * @summary The default endpoint for "forget password" - NOT READY
 * @tags Authentification
 * @param {string} email.query.deprecated Work in progress
 * @return {object} 200 - success
 * @return {string} 500 - server error
 */
router.post('/api/auth/forgot', async (req, res) => {
	try {
		const { email } = req.body
		// Todo need to find a user related to the email
		res.send({
			message: `Notification sent to ${email}`,
		})
	} catch (e) {
		res.status(500).send()
	}
})

module.exports = router