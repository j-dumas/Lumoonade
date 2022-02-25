const pagination = (req, res, next) => {
	if (!req.query.page) req.page = 1
	else req.page = parseInt(req.query.page)
	if (!req.query.limit) req.limit = 5
	else req.limit = parseInt(req.query.limit)
	req.skipIndex = (req.page - 1) * req.limit
	next()
}

module.exports = pagination
