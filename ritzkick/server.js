require('dotenv').config()
const fs = require('fs')

const express = require('express'),
	next = require('next')

const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swagger')

require('./db/mongodb')

const userRouter = require('./api/router/user')
const walletRouter = require('./api/router/wallet')
const watchlistRouter = require('./api/router/watchlist')
const favoriteRouter = require('./api/router/favorite')
const assetRouter = require('./api/router/asset')
const defaultRouter = require('./api/default')

const log = require('./utils/logging')
const { createServer } = require('https')
const { fstat } = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const ssl = process.env.SSL || false

const httpsOptions = {}
if (ssl == 'true') {
	log.info('SERVER', 'Reading certificates')
	httpsOptions.key = fs.readFileSync('/usr/src/backend/certificates/privkey.pem')
	httpsOptions.cert = fs.readFileSync('./certificates/fullchain.pem')
}

const app = next({ dev })
const handle = app.getRequestHandler()
if (ssl == 'true')
	app.prepare().then(() => {
		log.info('SERVER', 'Starting in HTTPS')
		createServer(httpsOptions, (req, res) => {
			const parsedURL = parse(req.url, true)
			handle(req, res, parsedURL)
		})
	})
else
	app.prepare().catch((ex) => {
		log.error('SERVER', 'Launch error', ex.stack)
		process.exit(1)
	})

const server = express()

expressJSDocSwagger(server)(swaggerOptions)

server.use(assetRouter)
server.use(favoriteRouter)
server.use(watchlistRouter)
server.use(walletRouter)
server.use(userRouter)
server.use(defaultRouter)

server.get('*', (req, res) => {
	return handle(req, res)
})

server.listen(port, (err) => {
	if (err) throw err
	log.info('SERVER', `Ready on port ${port}`)
})
