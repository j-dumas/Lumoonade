const jwt = require('jsonwebtoken')
const User = require('../../db/model/user')
const { UnauthorizedHttpError, sendError } = require('../../utils/http_errors')
const fs = require('fs')

// ----------------------------------------
//  Middleware for authentification purpuses
// -----------------------------------------

const verifyOptions = {
	algorithm: 'ES256',
	issuer: ['LUMOONADE', 'localhost', '127.0.0.1'],
	audience: ['https://lumoonade.com', 'localhost', '127.0.0.1'],
	subject: 'Lumoonade Auth'
}

const auth = async (req, res, next) => {
	try {
		const publicKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-pub-key.pem`)

		//  Decoding the jwt and finding a user related to it.
		const token = req.header('Authorization').replace('Bearer', '').trim()
		const decoded = jwt.verify(token, publicKey, verifyOptions)

		// Trying to find a user that match the _id and have an active session.
		const user = await User.findOne({ _id: decoded._id, 'sessions.session': token })
		if (!user) {
			throw new Error('Please authenticate first')
		}

		// In case someone tries to see content without confirming his email.
		if (!user.validatedEmail) {
			throw new Error('Please validate your email first.')
		}

		// Passing the token and the user to all request that uses the middleware.
		req.token = token
		req.user = user
		next()
	} catch (e) {
		// Not using custom http errors for testing
		// There is only one type of error thrown here anyway
		res.status(401).send({
			error: e.message
		})
	}
}

module.exports = auth
