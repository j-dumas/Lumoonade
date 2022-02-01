const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
		},
		fullname: {
			type: String,
			trim: true,
		},
		price: {
			type: Number,
			default: 0,
			validate(price) {
				if (price < 0) {
					throw new Error('Unable to set a price under 0.')
				}
			},
		},
		volume: {
			type: Number,
			default: 0,
		},
		creation_date: {
			type: String,
			default: new Date().toTimeString(),
			validate(date) {},
		},
		searched_count: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset
