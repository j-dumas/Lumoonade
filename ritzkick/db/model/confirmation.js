const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const validator = require('validator').default
const fs = require('fs')

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
	confirmationToken: {
		type: String,
		trim: true
	},
	secret: {
		type: String,
		default: crypto.randomBytes(64).toString('hex')
	}
})

const jwtOptions = {
	algorithm: 'ES256',
	subject: 'Lumoonade Auth'
}

confirmationSchema.methods.makeConfirmationToken = async function (host) {
	const confirmation = this
	const privateKey = fs.readFileSync(`${__dirname}/../../config/key/${process.env.ES256_KEY}-priv-key.pem`)
	const token = jwt.sign({ email: confirmation.email, secret: confirmation.secret }, privateKey, {
		expiresIn: '10m',
		...jwtOptions,
		issuer: host,
		audience: host
	})
	confirmation.confirmationToken = token
	await confirmation.save()
	return token
}

const Confirmation = mongoose.model('Confirmation', confirmationSchema)

module.exports = Confirmation
