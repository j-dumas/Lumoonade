const express = require('express')
const router = express.Router()

/**
 * GET /api
 * @summary The default endpoint
 * @return {object} 200 - success
 */
router.get('/api/', (req, res) => {
	res.status(200).send({
		message: 'Hello',
	})
})

module.exports = router
