require('dotenv').config()

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

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().catch((ex) => {
	console.error(ex.stack)
	process.exit(1)
})

const server = express()

expressJSDocSwagger(server)(swaggerOptions)

server.use(assetRouter)
server.use(favoriteRouter)
server.use(watchlistRouter)
server.use(walletRouter)
server.use(userRouter)

server.get('*', (req, res) => {
	return handle(req, res)
})

server.listen(port, (err) => {
	if (err) throw err
	console.log(`Ready on port ${port}`)
})
