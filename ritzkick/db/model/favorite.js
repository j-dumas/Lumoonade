const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
	},
	{
		timestamps: true,
	}
)

const Favorite = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorite
