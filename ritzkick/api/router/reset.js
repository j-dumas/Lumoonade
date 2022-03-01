const express = require('express')
const Reset = require('../../db/model/reset')
const validator = require('validator').default
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../db/model/user')
const emailSender = require('../../app/email/email')
const axios = require('axios').default
const fs = require('fs')

/**
 * Reset Email Model
 * @typedef {object} ResetEmail
 * @property {string} email.required
 */

/**
 * Verify Reset Email Model
 * @typedef {object} RedeemResetEmail
 * @property {string} resetToken.required
 * @property {string} password.required
 * @property {string} confirmation.required
 */

/**
 * POST /api/reset
 * @summary Creates a reset link in the database (sends an email to the user)
 * @tags Reset
 * @param {ResetEmail} request.body.required - email to reset from
 * @example request - example payload
 * {
 *  "email": "email@mail.com"
 * }
 * @return {object} 201 - created
 * @example
 * {
 * }
 * @return {string} 400 - bad request
 * @example response 400 - invalid email provided
 * {
 *  "message": "Please provide a valid email."
 * }
 */
router.post('/api/reset', async (req, res) => {
	try {
		const { email } = req.body
		if (!validator.isEmail(email)) {
			throw new Error('Please provide a valid email.')
		}
		const user = await User.findOne({ email })
		if (user) {
			const _ = await dropIfExist(user.email)
			// Maybe do something if it exists...
			const reset = new Reset({ email })
			await reset.save()
			const resetLink = await reset.makeResetToken(req.host.toString().split(':')[0])
			// Email sent with the valid url for forgot password.
			// This is just a dummy value.
			let url = `${process.env.SSL == 'false' ? 'http' : 'https'}://${process.env.NEXT_PUBLIC_HTTPS}:${
				process.env.NEXT_PUBLIC_PORT
			}/reset-password?key=${resetLink}`
			emailSender.sendResetPasswordEmail(user.email, url)
		}
		res.status(201).send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

const verifyOptions = {
	algorithm: 'ES256',
	issuer: ['LUMOONADE', 'localhost', '127.0.0.1'],
	audience: ['https://lumoonade.com', 'localhost', '127.0.0.1'],
	subject: 'Lumoonade Auth'
}

/**
 * GET /api/reset/verify/{token}
 * @summary Verify if the token is a valid reset token
 * @tags Reset
 * @return {object} 200 - success
 * @return {string} 400 - bad request
 * @example response 400 - invalid email provided
 * {
 *  "message": "Token may be outdated. | Token is corrupted"
 * }
 */
router.get('/api/reset/verify/:jwt', async (req, res) => {
	try {
		const publicKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-pub-key.pem`)

		const token = req.params.jwt
		const decoded = jwt.verify(token, publicKey, verifyOptions)
		const { email, secret } = decoded
		const reset = await Reset.findOne({ email, secret })
		if (!reset) {
			throw new Error('Token may be outdated.')
		}

		const decodedTokenStored = jwt.verify(reset.resetToken, publicKey, verifyOptions)

		const modified = !Object.keys(decoded).every((key) => {
			return decoded[key] === decodedTokenStored[key]
		})

		if (modified) {
			throw new Error('Token is corrupted')
		}

		reset.attemps = parseInt(reset.attemps) + 1
		await reset.save()
		res.send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

/**
 * POST /api/reset/redeem
 * @summary Set a new password for the user
 * @tags Reset
 * @param {RedeemResetEmail} request.body.required
 * @example request - example payload
 * {
 *  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *  "password": "123456789",
 *  "confirmation": "123456789"
 * }
 * @return {object} 200 - success
 * @return {string} 400 - bad request
 * @example response 400 - invalid email provided
 * {
 *  "message": "Error explaining the situation"
 * }
 */
router.post('/api/reset/redeem', async (req, res) => {
	try {
		const { resetToken, password, confirmation } = req.body

		if (!resetToken || !password || !confirmation) {
			throw new Error('Please provide the minimum information to make the request')
		}

		if (
			validator.isEmpty(String(resetToken).trim()) ||
			validator.isEmpty(String(password).trim()) ||
			validator.isEmpty(String(confirmation).trim())
		) {
			throw new Error('Please provide values to your fields')
		}

		if (password !== confirmation) {
			throw new Error('Passwords do not match')
		}

		let response = await axios
			.get(
				`${process.env.SSL == 'false' ? 'http' : 'https'}://${process.env.URL}:${
					process.env.PORT
				}/api/reset/verify/${resetToken}`
			)
			.catch((e) => {
				return e
			})

		if (response.isAxiosError) {
			throw new Error('Cannot update the profile.')
		}

		const publicKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-pub-key.pem`)

		const decoded = jwt.verify(resetToken, publicKey, verifyOptions)
		const { email } = decoded
		const user = await User.findOne({ email })

		if (!user) {
			throw new Error('No user matches the email')
		}

		user['password'] = password
		user.sessions = []
		await user.save()

		await Reset.findOneAndDelete({ email })

		res.send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

/**
 * Drop the reset link if it finds one
 * @param {string} email
 * @returns the content if it exists
 */
const dropIfExist = async (email) => {
	return await Reset.findOneAndDelete({ email })
}

module.exports = router
