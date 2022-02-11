const mongoose = require('mongoose')
const log = require('../utils/logging')

const url = process.env.DB_URL

mongoose
	.connect(url, { autoIndex: true })
	.then((res) => {
		log.info('DB', 'Connected to the database')
	})
	.catch((err) => {
		log.error('DB', 'Unable to connect to the database', err.message)
	})
