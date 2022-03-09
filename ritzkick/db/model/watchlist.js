const mongoose = require('mongoose')
const { BadRequestHttpError } = require('../../utils/http_errors')

const watchlistSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			required: true
		},
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		parameter: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		target: {
			type: Number,
			required: true,
			validate(target) {
				if (target < 0) {
					throw new BadRequestHttpError('Target cannot be set under 0.')
				}
			}
		}
	},
	{
		timestamps: true
	}
)

const Watchlist = mongoose.model('Watchlist', watchlistSchema)

module.exports = Watchlist
