const mongoose = require('mongoose')
const { BadRequestHttpError } = require('../../utils/http_errors')
const Transaction = require('./transaction')

const walletSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			required: true,
			trim: true
		},
		asset: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		history: [
			{
				transaction: {
					type: mongoose.Types.ObjectId,
					trim: true
				}
			}
		],
		amount: {
			type: Number,
			default: 0,
			validate(amount) {
				if (amount < 0) {
					throw new BadRequestHttpError('Unable to set an amount under 0.')
				}
			}
		}
	},
	{
		timestamps: true
	}
)

walletSchema.virtual('hist', {
	localField: 'history.transaction',
	foreignField: '_id',
	ref: 'Transaction'
})

walletSchema.methods.appendTransaction = async function (transaction) {
	const wallet = this
	wallet.history = wallet.history.concat({ transaction: transaction._id })
	await wallet.save()
}

walletSchema.methods.removeTransaction = async function (transaction) {
	const wallet = this
	wallet.history = wallet.history.filter((hist) => hist.transaction._id.toString() !== transaction._id.toString())
	await wallet.save()
}

walletSchema.pre('remove', async function (next) {
	const wallet = this
	await Transaction.deleteMany({ wallet: wallet._id })
	next()
})

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet
