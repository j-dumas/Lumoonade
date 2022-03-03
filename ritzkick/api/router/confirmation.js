const express = require('express')
const router = express.Router()
const Confirmation = require('../../db/model/confirmation')
const User = require('../../db/model/user')
const emailSender = require('../../app/email/email')
const validator = require('validator').default
const axios = require('axios').default
const jwt = require('jsonwebtoken')
const fs = require('fs')
const https = require('https')

const verifyOptions = {
	algorithm: 'ES256',
	issuer: ['LUMOONADE', 'localhost', '127.0.0.1'],
	audience: ['https://lumoonade.com', 'localhost', '127.0.0.1'],
	subject: 'Lumoonade Auth'
}

router.post('/api/confirmations', async (req, res) => {
	try {
		const { email } = req.body
		if (!email) {
			throw new Error('Please provide an email in the body.')
		}

		if (!validator.isEmail(email)) {
			throw new Error('Please provide a valid email format.')
		}

		const user = await User.findOne({ email })
		if (user && user.validatedEmail) {
			throw new Error(`You can't confirm twice the email.`)
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
		}).catch(_ => { return { data: { url: link } } } )
		emailSender.sendConfirmationEmail(email, response.data.url)
		res.status(201).send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

router.get('/api/confirmation/verify/:jwt', async (req, res) => {
	try {
		const publicKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-pub-key.pem`)
		const token = req.params.jwt
		const decoded = jwt.verify(token, publicKey, verifyOptions)
		const { email, secret } = decoded
		const confirmation = await Confirmation.findOne({ email, secret })
		if (!confirmation) {
			throw new Error('Token may be outdated.')
		}

		const decodedTokenStored = jwt.verify(confirmation.confirmationToken, publicKey, verifyOptions)

		const modified = !Object.keys(decoded).every((key) => {
			return decoded[key] === decodedTokenStored[key]
		})

		if (modified) {
			throw new Error('Token is corrupted')
		}

		await Confirmation.findOneAndDelete({ email, secret })
		const user = await User.findOne({ email })
		await user.verified()
		res.send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

const dropIfExist = async (email) => {
	return await Confirmation.findOneAndDelete({ email })
}

module.exports = router
