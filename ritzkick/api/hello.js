const express = require('express')
const router = express.Router()

router.get('/api/hello', (req, res) => {
	res.status(200).send({
		message: 'Hello',
	})
})

module.exports = router
