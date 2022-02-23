const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const MAX_ATTEMPS_PER_RESET = 5

const confirmationSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true
	},
	confirmationTokens: [
        {
            token: {
                type: String,
                trim: true
            }
        }
    ],
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

	confirmation.confirmationTokens = confirmationTokens
	await confirmation.save()
	return token
}

const Confirmation = mongoose.model('Confirmation', resetSchema)

module.exports = Confirmation