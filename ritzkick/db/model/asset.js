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
		timestamps: true
	}
)

assetSchema.statics.exists = async (slug) => {
	return (await Asset.findOne({ slug })) !== null
}

assetSchema.statics.isEmpty = async () => {
	return (await mongoose.connection.db.collection('Asset').count()) == 0
}

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset
