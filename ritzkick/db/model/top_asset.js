const mongoose = require('mongoose')

const topAssetSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true
		},
		percentage: {
			type: Number,
			required: true
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

topAssetSchema.statics.isEmpty = async (name) => {
	return (await mongoose.connection.db.collection(name).count()) === 0
}

const TopGainer = mongoose.model('TopGainer', topAssetSchema)
const TopLoser = mongoose.model('TopLoser', topAssetSchema)

module.exports = { TopGainer, TopLoser }
