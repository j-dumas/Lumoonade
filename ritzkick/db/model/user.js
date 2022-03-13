const mongoose = require('mongoose')
const validator = require('validator').default
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Favorite = require('./favorite')
const Wallet = require('./wallet')
const Watchlist = require('./watchlist')
const Reset = require('./reset')
const Confirmation = require('./confirmation')

const fs = require('fs')
const { NotFoundHttpError, BadRequestHttpError } = require('../../utils/http_errors')
const Permission = require('./permission')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			required: true,
			validate(email) {
				if (!validator.isEmail(email)) {
					throw new BadRequestHttpError('Invalid Email Format')
				}
			}
		},
		username: {
			type: String,
			trim: true,
			minlength: 4,
			required: true,
			maxlength: 20,
			validate(username) {
				if (validator.isEmpty(username)) {
					throw new BadRequestHttpError('Please provide a username.')
				}
			}
		},
		password: {
			type: String,
			trim: true,
			minlength: 8,
			required: true,
			validate(password) {
				if (validator.isEmpty(password)) {
					throw new BadRequestHttpError('Please provide a password.')
				}
			}
		},
		favorite_list: [
			{
				favorite: {
					type: mongoose.Schema.Types.ObjectId
				}
			}
		],
		sessions: [
			{
				session: {
					type: String,
					required: true
				}
			}
		],
		wallet_list: [
			{
				wallet: {
					type: mongoose.Schema.Types.ObjectId
				}
			}
		],
		watchlist_list: [
			{
				watch: {
					type: mongoose.Schema.Types.ObjectId
				}
			}
		],
		validatedEmail: {
			type: Boolean,
			default: false
		},
		google: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (doc, ret) {
				delete ret.validatedEmail
				delete ret.password
				delete ret.__v
			}
		}
	}
)

/**
 * This is for creating a link between Wallet and User
 */
userSchema.virtual('wallet', {
	ref: 'Wallet',
	localField: 'wallet_list.wallet',
	foreignField: '_id'
})

/**
 * This is for creating a link between Favorite and User
 */
userSchema.virtual('favorite', {
	ref: 'Favorite',
	localField: 'favorite_list.favorite',
	foreignField: '_id'
})

/**
 * This is for creating a link between Watchlist and User
 */
userSchema.virtual('watchlist', {
	ref: 'Watchlist',
	localField: 'watchlist_list.watch',
	foreignField: '_id'
})

const jwtOptions = {
	algorithm: 'ES256',
	subject: 'Lumoonade Auth'
}

userSchema.methods.makeAuthToken = async function (host) {
	const user = this
	const privateKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-priv-key.pem`)
	const token = jwt.sign({ _id: user._id.toString() }, privateKey, {
		...jwtOptions,
		issuer: host,
		audience: host
	})

	// Appending the session to the current sessions.
	user.sessions = user.sessions.concat({ session: token })

	await user.save()
	return token
}

userSchema.methods.verified = async function () {
	const user = this
	user.validatedEmail = true
	await user.save()
}

userSchema.methods.makeProfile = async function () {
	const user = this
	const { email, username, favorite_list, sessions, wallet_list, watchlist_list, createdAt, updatedAt } = user
	const profile = {
		email,
		username,
		favorite_list: favorite_list.length,
		sessions: sessions.length,
		wallet_list: wallet_list.length,
		watchlist_list: watchlist_list.length,
		createdAt,
		updatedAt
	}
	return profile
}

userSchema.methods.addWalletAndSave = async function (id) {
	const user = this
	user.wallet_list.push({
		wallet: id
	})
	await user.save()
}

userSchema.methods.removeWalletAndSave = async function (id) {
	const user = this
	user.wallet_list = user.wallet_list.filter((wallet) => wallet.wallet.toString() !== id.toString())
	await user.save()
}

userSchema.methods.addWatchlistAlertAndSave = async function (id) {
	const user = this
	user.watchlist_list.push({
		watch: id
	})
	await user.save()
}

userSchema.methods.removeWatchlistAlertAndSave = async function (id) {
	const user = this
	user.watchlist_list = user.watchlist_list.filter((watchlist) => watchlist.watch.toString() !== id.toString())
	await user.save()
}

userSchema.methods.addFavoriteAndSave = async function (id) {
	const user = this
	user.favorite_list.push({
		favorite: id
	})
	await user.save()
}

userSchema.methods.removeFavoriteAndSave = async function (id) {
	const user = this
	user.favorite_list = user.favorite_list.filter((favorite) => favorite.favorite.toString() !== id.toString())
	await user.save()
}

userSchema.methods.isOldPassword = async function (oldPassword) {
	const user = this
	const match = await bcrypt.compare(oldPassword, user.password)
	return match
}

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email })
	if (!user) {
		throw new NotFoundHttpError('Could not find an user.')
	}

	const match = await bcrypt.compare(password, user.password)
	if (!match) {
		throw new BadRequestHttpError('Wrong Password.')
	}

	return user
}

/**
 * This is called when the .save() is called on the user
 */
userSchema.pre('save', async function (next) {
	const user = this
	const SECURE_SALT_NUMBER = 8

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, SECURE_SALT_NUMBER)
	}

	next()
})

/**
 * This is called when the user is getting removed.
 */
userSchema.pre('remove', async function (next) {
	const user = this
	await Permission.deleteMany({ user: user._id })
	await Favorite.deleteMany({ owner: user._id })
	await Wallet.deleteMany({ owner: user._id })
	await Watchlist.deleteMany({ owner: user._id })
	await Reset.deleteMany({ email: user.email })
	await Confirmation.deleteMany({ email: user.email })
	next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
