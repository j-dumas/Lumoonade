const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const MAX_ATTEMPS_PER_RESET = 5

const resetSchema = new mongoose.Schema(
	{
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
                    throw new Error('Cannot set attemps to a negative value')
                }

                if (value > MAX_ATTEMPS_PER_RESET) {
                    throw new Error('Too many attemps')
                }
            }
        },
        secret: {
            type: String,
            default: crypto.randomBytes(64).toString('hex')
        }
	}
)

resetSchema.methods.makeResetToken = async function() {
    const reset = this
    const token = jwt.sign({ email: reset.email, secret: reset.secret }, process.env.JWTSECRET, { expiresIn: '5m' })

    reset.resetToken = token
    await reset.save()
    return token
}

const Reset = mongoose.model('Reset', resetSchema)

module.exports = Reset
