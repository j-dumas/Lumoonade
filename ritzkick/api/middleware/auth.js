const jwt = require('jsonwebtoken')
const User = require('../../db/model/user')
const { UnauthorizedHttpError, sendError } = require('../../utils/http_errors')

// ----------------------------------------
//  Middleware for authentification purpuses
// -----------------------------------------
const auth = async (req, res, next) => {
	try {
		//  Decoding the jwt and finding a user related to it.
		const token = req.header('Authorization').replace('Bearer', '').trim()
		const decoded = jwt.verify(token, process.env.JWTSECRET)

		// Trying to find a user that match the _id and have an active session.
		const user = await User.findOne({ _id: decoded._id, 'sessions.session': token })
		if (!user) {
			throw new UnauthorizedHttpError()
		}

		// Passing the token and the user to all request that uses the middleware.
		req.token = token
		req.user = user
		next()
	} catch (e) {
		sendError(res, e)
	}
}

module.exports = auth
