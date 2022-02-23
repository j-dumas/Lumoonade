const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const validator = require('validator').default

const confirmationSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		validate(email) {
			if (!validator.isEmail(email)) {
				throw new Error('Please provide a valid email.')
			}
		}
	},
	confirmationTokens: {
		type: String,
        trim: true
	},
	secret: {
		type: String,
		default: crypto.randomBytes(64).toString('hex')
	}
})

confirmationSchema.methods.makeConfirmationToken = async function () {
	const confirmation = this
	const token = jwt.sign({ email: confirmation.email, secret: confirmation.secret }, process.env.RESET_JWT_SECRET, {
		expiresIn: '10m'
	})
	confirmation.confirmationTokens = token
	await confirmation.save()
	return token
}

const Confirmation = mongoose.model('Confirmation', confirmationSchema)

module.exports = Confirmation