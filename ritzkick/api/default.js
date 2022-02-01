const express = require('express')

const router = express.Router()

/**
 * GET /api
 * @summary The default endpoint
 * @return {object} 200 - success
 */
router.get('/api', (req, res) => {
	res.send()
})

module.exports = router

// https://brikev.github.io/express-jsdoc-swagger-docs/#/validator
