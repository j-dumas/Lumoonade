const pagination = async (req, res, next) => {
	if (!req.query.page) res.page = 1
	else res.page = parseInt(req.query.page)
	if (!req.query.limit) res.limit = 5
	else limit = parseInt(req.query.limit)
	res.skipIndex = (res.page - 1) * res.limit
	next()
}

module.exports = pagination
