class HttpError extends Error {
	constructor(message, status) {
		super(message)
		this.status = status
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

class BadRequestHttpError extends HttpError {
	constructor(message) {
		super(message, 400)
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

class UnauthorizedHttpError extends HttpError {
	constructor(message = 'Please authenticate first') {
		super(message, 401)
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

class ForbiddenHttpError extends HttpError {
	constructor(message = 'Forbidden') {
		super(message, 403)
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

class NotFoundHttpError extends HttpError {
	constructor(message = 'Not Found') {
		super(message, 404)
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

class ConflictHttpError extends HttpError {
	constructor(message = 'Already created') {
		super(message, 409)
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

class ServerError extends HttpError {
	constructor(message = 'Internal Server Error') {
		super(message, 500)
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

function sendError(res, e) {
	if (e.status)
		res.status(e.status).send({
			message: e.message
		})
	else
		res.status(500).send({
			message: e.message
		})
}

module.exports = {
	sendError,
	BadRequestHttpError,
	UnauthorizedHttpError,
	NotFoundHttpError,
	ConflictHttpError,
	ServerError,
	ForbiddenHttpError
}
