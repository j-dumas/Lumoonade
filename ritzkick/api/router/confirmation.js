const express = require('express')
const router = express.Router()
const Confirmation = require('../../db/model/confirmation')
const User = require('../../db/model/user')
const emailSender = require('../../app/email/email')
const validator = require('validator').default
const axios = require('axios').default
const jwt = require('jsonwebtoken')
const fs = require('fs')
const rateLimit = require('express-rate-limit')
const https = require('https')
const { sendError, BadRequestHttpError, ConflictHttpError, ServerError } = require('../../utils/http_errors')

const verifyOptions = {
	algorithm: 'ES256',
	issuer: ['LUMOONADE', 'localhost', '127.0.0.1'],
	audience: ['https://lumoonade.com', 'localhost', '127.0.0.1'],
	subject: 'Lumoonade Auth'
}

// Config for the creation call.
const creationLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 10,
	message: { message: 'Too many requests, slow down!' },
	standardHeaders: true,
	legacyHeaders: false
})

/**
 * Confirmation Request Model
 * @typedef {object} ConfirmationRequest
 * @property {string} email.required - Email to send it to
 */

/**
 * POST /api/confirmations
 * @summary Creating a confirmation email
 * @tags Confirmation
 * @param {ConfirmationRequest} request.body.required - Confirmation info
 * @example request - example payload
 * {
 * 	"email": "foo@bar.foo"
 * }
 * @return 201 - created
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "Please provide a valid email format | Please provide an email in the body | You can't confirm twice the email"
 * }
 */
router.post('/api/confirmations', creationLimiter, async (req, res) => {
	try {
		const { email } = req.body
		if (!email) {
			throw new BadRequestHttpError('Please provide an email in the body.')
		}

		if (!validator.isEmail(email)) {
			throw new BadRequestHttpError('Please provide a valid email format.')
		}

		const user = await User.findOne({ email })
		if (user && user.validatedEmail) {
			throw new ConflictHttpError(`You can't confirm twice the email.`)
		}

		const _ = await dropIfExist(email)
		const confirmation = new Confirmation({ email })
		await confirmation.save()
		let token = await confirmation.makeConfirmationToken(req.host.toString().split(':')[0])
		let link = `https://${process.env.URL}:${process.env.PORT}/email-confirmation?key=${token}`
		let response = await axios({
			url: `https://${process.env.URL}:${process.env.PORT}/api/redirects`,
			method: 'POST',
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				url: link,
				destroyable: true
			})
		}).catch((_) => {
			return { data: { url: link } }
		})
		emailSender.sendConfirmationEmail(email, response.data.url)
		res.status(201).send()
	} catch (e) {
		sendError(res, e)
	}
})

/**
 * Confirmation Verify Request Model
 * @typedef {object} ConfirmationVerifyRequest
 * @property {string} jwt.required - jwt for decoding purposes
 */

/**
 * GET /api/confirmations/{token}
 * @summary Verifies if the token is valid.
 * @tags Confirmation
 * @return 200 - valid
 * @return {string} 400 - bad request
 * @example response - 400 - example of a possible error message
 * {
 * 	"message": "Token may be outdated | Token is corrupted"
 * }
 */
router.get('/api/confirmation/verify/:jwt', creationLimiter, async (req, res) => {
	try {
		const publicKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-pub-key.pem`)
		const token = req.params.jwt
		const decoded = jwt.verify(token, publicKey, verifyOptions)
		const { email, secret } = decoded
		const confirmation = await Confirmation.findOne({ email, secret })
		if (!confirmation) {
			throw new ConflictHttpError('Token may be outdated.')
		}

		const decodedTokenStored = jwt.verify(confirmation.confirmationToken, publicKey, verifyOptions)

		const modified = !Object.keys(decoded).every((key) => {
			return decoded[key] === decodedTokenStored[key]
		})

		if (modified) {
			throw new ConflictHttpError('Token is corrupted')
		}

		await Confirmation.findOneAndDelete({ email, secret })
		const user = await User.findOne({ email })
		await user.verified()
		res.send()
	} catch (e) {
		sendError(res, e)
	}
})

const dropIfExist = async (email) => {
	return await Confirmation.findOneAndDelete({ email })
}

module.exports = router
