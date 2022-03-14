const mongoose = require('mongoose')
const log = require('../utils/logging')

const addSlugsToDB = require('../services/SlugService')

const url = process.env.DB_URL

/**
 * This is creating a connection to the mongodb database.
 * We don't need to use async/await because we don't need to wait for a response.
 */
mongoose
	.connect(url, { autoIndex: true })
	.then(async (_) => {
		log.info('DB', 'Connected to the database')
		await addSlugsToDB()
		log.info('DB', 'Assets filled')
	})
	.catch((err) => {
		log.error('DB', 'Unable to connect to the database', err.message)
	})
