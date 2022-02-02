const mongoose = require('mongoose')
const validator = require('validator').default
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
					throw new Error('Invalid Email Format')
				}
			},
		},
		username: {
			type: String,
			unique: true,
			trim: true,
			minlength: 4,
			required: true,
			validate(username) {
				if (validator.isEmpty(username)) {
					throw new Error('Please provide a username.')
				}
			},
		},
		password: {
			type: String,
			trim: true,
			minlength: 8,
			required: true,
			validate(password) {
				if (validator.isEmpty(password)) {
					throw new Error('Please provide a password.')
				}
			},
		},
		favorite_list: [
			{
				favorite: {
					type: mongoose.Schema.Types.ObjectId,
				},
			},
		],
		sessions: [
			{
				session: {
					type: String,
					required: true
				},
			},
		],
		wallet_list: [
			{
				wallet: {
					type: mongoose.Schema.Types.ObjectId,
				},
			},
		],
		watchlist_list: [
			{
				watch: {
					type: mongoose.Schema.Types.ObjectId,
				},
			},
		],
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (doc, ret) {
				delete ret.password
				delete ret.__v
				ret.wallet_list = ret.wallet_list.length
				ret.favorite_list = ret.favorite_list.length
				ret.sessions = ret.sessions.length
				ret.watchlist_list = ret.watchlist_list.length
			},
		},
	}
)

// ---------------------------------
//
// ---------------------------------
userSchema.virtual('wallet', {
	ref: 'Wallet',
	localField: 'wallet_list.wallet',
	foreignField: '_id',
})

// ---------------------------------
//
// ---------------------------------
userSchema.virtual('favorite', {
	ref: 'Favorite',
	localField: 'favorite_list.favorite',
	foreignField: '_id',
})

// ---------------------------------
//	
// ---------------------------------
userSchema.virtual('watchlist', {
	ref: 'Watchlist',
	localField: 'watchlist_list.watch',
	foreignField: '_id',
})

userSchema.methods.makeAuthToken = async function() {
	const user = this
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTSECRET)

	// Appending the session to the current sessions.
	user.sessions = user.sessions.concat({ session: token })

	await user.save()
	return token
}

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email })
	if (!user) {
		throw new Error('Could not login properly.')
	}
	
	const match = await bcrypt.compare(password, user.password)
	if (!match) {
		throw new Error('Could not login properly.')
	}

	return user
}

userSchema.pre('save', async function(next) {
	const user = this

	if (user.isModified('password')) {
		// 8 is a perfect number between secure and fast
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
