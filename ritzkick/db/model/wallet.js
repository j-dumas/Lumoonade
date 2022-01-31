const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true,
		},
		asset: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true,
		},
		amount: {
			type: Number,
			default: 0,
			validate(amount) {
				if (amount < 0) {
					throw new Error('Unable to set an amount under 0.')
				}
			},
		},
	},
	{
		timestamps: true,
	}
)

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet
