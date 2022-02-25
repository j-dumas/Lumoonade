const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true
		},
        wallet: {
            type: mongoose.Types.ObjectId,
            required: true,
            trim: true
        },
		asset: {
			type: String,
			required: true,
			trim: true
		},
        when: {
            type: String
        },
		paid: {
			type: Number,
            required: true,
			validate(amount) {
				if (amount < 0) {
					throw new Error('Unable to set an amount under 0.')
				}
			}
		},
        boughtAt: {
			type: Number,
            required: true,
			validate(amount) {
				if (amount < 0) {
					throw new Error('Unable to set an amount under 0.')
				}
			}
		}
	},
	{
		toJSON: {
            transform: function (doc, ret) {
				delete ret.owner
                delete ret.wallet
				delete ret.__v
			}
        }
	}
)

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
