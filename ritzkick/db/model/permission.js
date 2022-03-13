const mongoose = require('mongoose')

const permissionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			trim: true,
			unique: true
		},
		permissionLevel: {
			type: Number,
			default: 0
		},
		assigner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			trim: true
		}
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (_, ret) {
				delete ret.__v
				delete ret.createdAt
				delete ret.updatedAt
			}
		}
	}
)

const Permission = mongoose.model('Permission', permissionSchema)

module.exports = Permission
