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
		changePercent: {
			type: Number,
			default: 0
		},
		change: {
			type: Number,
			default: 0
		},
		volume: {
			type: Number,
			default: 0,
		},
		supply: {
			type: Number,
			validate(supply) {
				if (supply < 0) {
					throw new Error('Cannot set the supply amount under 0.')
				}
			}
		},
		creationDate: {
			type: Number,
			default: Date.now(),
			validate(date) {
				if (date > Date.now()) {
					throw new Error('Cannot set a futur creation date.')
				}
			},
		},
		searchedCount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

assetSchema.statics.exists = async (slug) => {
	return (await Asset.findOne({ slug })) !== null
}

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset
