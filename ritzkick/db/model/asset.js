const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true
		},
		searchedCount: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (doc, ret) {
				delete ret.__v
				delete ret.createdAt
				delete ret.updatedAt
			}
		}
	}
)

assetSchema.statics.isEmpty = async (name) => {
	return (await mongoose.connection.db.collection(name).count()) === 0
}

const Asset = mongoose.model('Asset', assetSchema)
const TopGainer = mongoose.model('TopGainer', assetSchema)
const TopLoser = mongoose.model('TopLoser', assetSchema)

module.exports = { Asset, TopGainer, TopLoser }
