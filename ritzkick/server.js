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
	httpsOptions.key = fs.readFileSync(`${__dirname}/certificates/privkey.pem`)
	httpsOptions.cert = fs.readFileSync(`${__dirname}/certificates/fullchain.pem`)
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

log.info('SERVER', 'Starting HTTP')

if (ssl == 'true') {
	log.info('SERVER', 'Starting HTTPS')
	serverHttps = https.createServer(httpsOptions, server)

	serverHttps.listen(port, (err) => {
		if (err) throw err
	})

	server.get('*', (req, res) => {
		const httpsUrl = `https://${req.headers['host']}${req.url}`
		if (req.protocol == 'http') log.debug('SERVER', `Redirecting to ${httpsUrl}`)
		res.redirect(httpsUrl)
	})

	serverHttp = http.createServer(server)
	serverHttp.listen(80, (err) => {
		if (err) throw err
		log.info('SERVER', `Ready on port 80`)
	})
} else {
	serverHttp = http.createServer(server)
	serverHttp.listen(port, (err) => {
		if (err) throw err
		log.info('SERVER', `Ready on port ${port}`)
	})
}
