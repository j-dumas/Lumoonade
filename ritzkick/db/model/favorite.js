const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Types.ObjectId,
			required: true
		},
		asset: {
			type: mongoose.Types.ObjectId,
			required: true
		}
	},
	{
		timestamps: true
	}
)

const Favorite = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorite
