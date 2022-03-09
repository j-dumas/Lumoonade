const express = require('express')
const { NotFoundHttpError, BadRequestHttpError, ConflictHttpError, sendError, ForbiddenHttpError } = require('../../utils/http_errors')

const Permission = require('../../db/model/permission')
const { Asset } = require('../../db/model/asset')
const Confirmation = require('../../db/model/confirmation')
const Favorite = require('../../db/model/favorite')
const Reset = require('../../db/model/reset')
const Shortcut = require('../../db/model/shortcut')
const Transaction = require('../../db/model/transaction')
const User = require('../../db/model/user')
const Wallet = require('../../db/model/wallet')
const Watchlist = require('../../db/model/watchlist')
const axios = require('axios').default
const timer = require('perf_hooks')

const roomManager = require('../../app/socket/room-manager')

const auth = require('../middleware/auth')
const perm = require('../middleware/perm')
const router = express.Router()

router.get('/api/website/details', [auth, perm], async (req, res) => {
	try {
		let response = {}
		response.assetsCount = await Asset.count()
		response.permissionsCount = await Permission.count()
		response.website = await getWebsiteActivity()
		response.accounts = await getUserStatistics()
		response.waiting = await getAccountQueries()
		response.wallets = await getWalletsInformation()
		response.interactions = await getUsersInteractions()
		response.sharedLinks = await getOutsideInteractions()
		res.send(response)
	} catch (e) {
		sendError(res, e)
	}
})

router.get('/api/website/status', [auth, perm], async (req, res) => {
	const apiUrls = [process.env.YAHOO_API, process.env.YAHOO_API_DASH]
	let calls = [] 
	apiUrls.forEach(url => {
		calls.push(new Promise((res, rej) => {
			let startAt = timer.performance.now()
			let config = {
				url,
				status: 'down'
			}
			axios.get(url + 'spark?symbols=TEST').then(_ => { 
				config.status = 'up'
				config.responseTimeInMillis = timer.performance.now() - startAt
				res(config) 
			}).catch(_ => {
				config.responseTimeInMillis = timer.performance.now() - startAt
				rej(config)
			})
		}))
	})
	const response = (await Promise.allSettled(calls)).map(answer => answer.value || answer.reason)
	res.send(response)
})

const getWebsiteActivity = async () => {
	let total = roomManager.total()
	let alive = roomManager.aliveRooms()
	let portfolioRooms = roomManager.activePortfolioRooms()
	return {
		websocketInUse: alive.length > 0,
		totalRooms: total,
		activeRooms: {
			count: alive.length,
			rooms: [...alive].map(room => room.name)
		},
		activePortfolioRooms: portfolioRooms.length,
		inactiveRooms: total - alive.length
	}
}

const getOutsideInteractions = async () => {
	return {
		available: await Shortcut.count(),
		destroyable: (await Shortcut.find({ destroyable: true })).length,
		permanent: (await Shortcut.find({ destroyable: false })).length,
		viewed: (await Shortcut.where('visits').gt(0)).length
	}
}

const getUsersInteractions = async () => {
	return {
		favorites: await Favorite.count(),
		alerts: await Watchlist.count()
	}
}

const getWalletsInformation = async () => {
	return {
		wallets: await Wallet.count(),
		transactions: await Transaction.count()
	}
}

const getAccountQueries = async () => {
	return {
		confirmations: await Confirmation.count(),
		resets: await Reset.count()
	}
}

const getUserStatistics = async () => {
	let count = await User.count()
	let validatedAccount = (await User.find({ validatedEmail: true })).length
	let online = (await User.where('sessions.session').gt(0)).length
	let googleAccounts = (await User.find({ google: true }))
	return {
		total: count,
		confirmed: validatedAccount,
		pending: count - validatedAccount,
		createdWithGoogle: googleAccounts.length,
		online,
		offline: count - online
	}
}

module.exports = router
