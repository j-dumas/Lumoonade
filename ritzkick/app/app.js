const express = require('express')
const server = express()

const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('../config/swagger')

require('../db/mongodb')

const userRouter = require('../api/router/user')
const walletRouter = require('../api/router/wallet')
const watchlistRouter = require('../api/router/watchlist')
const favoriteRouter = require('../api/router/favorite')
const assetRouter = require('../api/router/asset')
const alertRouter = require('../api/router/alert')
const authRouter = require('../api/router/auth')
const resetRouter = require('../api/router/reset')
const confirmationRouter = require('../api/router/confirmation')

const { default: helmet } = require('helmet')
const helmetOptions = require('../config/helmet')

expressJSDocSwagger(server)(swaggerOptions)

server.use(express.json())
server.use(helmet(helmetOptions))

setRouters()

function setRouters() {
	server.use(resetRouter)
server.use(authRouter)
server.use(assetRouter)
server.use(favoriteRouter)
server.use(alertRouter)
server.use(watchlistRouter)
server.use(walletRouter)
server.use(userRouter)
server.use(confirmationRouter)
}

module.exports = server
