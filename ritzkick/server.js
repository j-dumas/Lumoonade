require('dotenv').config()
require('./db/mongodb')

const fs = require('fs')

const http = require('http'),
	https = require('https')

const express = require('express'),
	next = require('next')

const userRouter = require('./api/router/user')
const walletRouter = require('./api/router/wallet')
const watchlistRouter = require('./api/router/watchlist')
const favoriteRouter = require('./api/router/favorite')
const assetRouter = require('./api/router/asset')
const defaultRouter = require('./api/default')

const log = require('./utils/logging')
const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swagger')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const ssl = process.env.SSL || false

const httpsOptions = {}
if (ssl == 'true') {
	log.info('SERVER', 'Reading certificates')
	httpsOptions.key = fs.readFileSync(`${__dirname}/certificates/privkey.key`)
	httpsOptions.cert = fs.readFileSync(`${__dirname}/certificates/fullchain.key`)
}

const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().catch((ex) => {
	log.error('SERVER', 'Launch error', ex.stack)
	process.exit(1)
})

let server = express()

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

if (ssl == 'true') {
	log.info('SERVER', 'Starting in HTTPS')
	server = https.createServer(httpsOptions, server)
} else {
	log.info('SERVER', 'Starting in HTTP')
	server = http.createServer(server)
}

server.listen(port, (err) => {
	if (err) throw err
	log.info('SERVER', `Ready on port ${port}`)
})
