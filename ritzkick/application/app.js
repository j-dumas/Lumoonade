const express = require('express')

require('../db/mongodb')

const userRouter = require('../api/router/user')
const walletRouter = require('../api/router/wallet')
const watchlistRouter = require('../api/router/watchlist')
const favoriteRouter = require('../api/router/favorite')
const assetRouter = require('../api/router/asset')
const authRouter = require('../api/router/auth')

const server = express()

server.use(express.json())

// Routers
server.use(authRouter)
server.use(assetRouter)
server.use(favoriteRouter)
server.use(watchlistRouter)
server.use(walletRouter)
server.use(userRouter)

module.exports = server