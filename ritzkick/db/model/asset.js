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

assetSchema.statics.exists = async (slug) => {
	return (await Asset.findOne({ slug })) !== null
}

assetSchema.statics.isEmpty = async () => {
	return (await mongoose.connection.db.collection('assets').count()) === 0
}

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset
