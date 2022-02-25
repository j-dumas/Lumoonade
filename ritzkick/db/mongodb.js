const mongoose = require('mongoose')
const log = require('../utils/logging')

const addSlugsToDB = require('../services/SlugService')

const url = process.env.DB_URL

mongoose
	.connect(url, { autoIndex: true })
	.then(async (res) => {
		log.info('DB', 'Connected to the database')
		await addSlugsToDB()
		log.info('DB', 'Assets filled')
	})
	.catch((err) => {
		log.error('DB', 'Unable to connect to the database', err.message)
	})
