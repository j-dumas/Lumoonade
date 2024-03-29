const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const fs = require('fs')
const { BadRequestHttpError } = require('../../utils/http_errors')

const MAX_ATTEMPS_PER_RESET = 5

const resetSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true
	},
	resetToken: {
		type: String,
		trim: true
	},
	attemps: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new BadRequestHttpError('Cannot set attemps to a negative value')
			}

			if (value > MAX_ATTEMPS_PER_RESET) {
				throw new BadRequestHttpError('Too many attemps')
			}
		}
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

resetSchema.methods.makeResetToken = async function (host) {
	const reset = this
	host = host || 'localhost'
	const privateKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-priv-key.pem`)
	const token = jwt.sign({ email: reset.email, secret: reset.secret }, privateKey, {
		expiresIn: '5m',
		...jwtOptions,
		issuer: host.toString(),
		audience: host.toString()
	})

	reset.resetToken = token
	await reset.save()
	return token
}

const Reset = mongoose.model('Reset', resetSchema)

module.exports = Reset
