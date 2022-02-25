const express = require('express')
const router = express.Router()
const Confirmation = require('../../db/model/confirmation')
const User = require('../../db/model/user')
const emailSender = require('../../application/email/email')
const validator = require('validator').default
const jwt = require('jsonwebtoken')

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
		let token = await confirmation.makeConfirmationToken()
		let link = `${process.env.SSL == 'false' ? 'http' : 'https'}://${process.env.NEXT_PUBLIC_HTTPS}:${
			process.env.NEXT_PUBLIC_PORT
		}/email-confirmation?key=${token}`
		emailSender.sendConfirmationEmail(email, link)
		res.status(201).send()
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

router.get('/api/confirmation/verify/:jwt', async (req, res) => {
	try {
		const token = req.params.jwt
		const decoded = jwt.verify(token, process.env.RESET_JWT_SECRET)
		const { email, secret } = decoded
		const confirmation = await Confirmation.findOne({ email, secret })
		if (!confirmation) {
			throw new Error('Token may be outdated.')
		}

		const decodedTokenStored = jwt.verify(confirmation.confirmationToken, process.env.RESET_JWT_SECRET)

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
