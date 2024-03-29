const express = require('express')
const server = express()

const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('../config/swagger')

require('../db/mongodb')

const userRouter = require('../api/router/user')
const permRouter = require('../api/router/website')
const walletRouter = require('../api/router/wallet')
const favoriteRouter = require('../api/router/favorite')
const assetRouter = require('../api/router/asset')
const alertRouter = require('../api/router/alert')
const authRouter = require('../api/router/auth')
const resetRouter = require('../api/router/reset')
const shortcutRouter = require('../api/router/shortcut')
const confirmationRouter = require('../api/router/confirmation')

const { default: helmet } = require('helmet')
const helmetOptions = require('../config/helmet')

expressJSDocSwagger(server)(swaggerOptions)

// Setting the configuration of the application
server.use(express.json())
server.use(helmet(helmetOptions))

// Setting the application routers
server.use(permRouter)
server.use(shortcutRouter)
server.use(resetRouter)
server.use(authRouter)
server.use(assetRouter)
server.use(favoriteRouter)
server.use(alertRouter)
server.use(walletRouter)
server.use(userRouter)
server.use(confirmationRouter)

module.exports = server
