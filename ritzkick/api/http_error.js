class HttpError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = HttpError;
