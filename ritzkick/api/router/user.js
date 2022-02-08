const express = require('express')
const authentification = require('../middleware/auth')

const router = express.Router()

router.get('/api/me', authentification, async (req, res) => {
	await req.user.populate({
		path: 'wallet',
	})
	await req.user.populate({
		path: 'favorite',
	})
	await req.user.populate({
		path: 'watchlist',
	})
	const profile = await req.user.makeProfile()
	profile.sessions = req.user.sessions.length
	profile.wallet_list = req.user.wallet
	profile.favorite_list = req.user.favorite
	profile.watchlist_list = req.user.watchlist
	res.send(profile)
})

router.get('/api/me/profile', authentification, async (req, res) => {
	const profile = await req.user.makeProfile()
	res.send(profile)
})

router.patch('/api/me/update', authentification, async (req, res) => {

	const updates = Object.keys(req.body)
	if (updates.length === 0) {
		return res.status(400).send({
			message: 'Please provide data to be modified'
		})
	}

	const { oldPassword, newPassword } = req.body
	if (oldPassword && newPassword) {
		const validation = await req.user.isOldPassword(oldPassword)
		if (validation) {
			console.log('new password!', oldPassword, newPassword)
			delete req.body.newPassword
			delete req.body.oldPassword
			req.body.password = newPassword
			updates = Object.keys(req.body)
		} else {
			console.log('Not the same password',oldPassword, newPassword)
		}
	}
    const allowed = ['username', 'password']
    const isValidPatch = updates.every((update) => allowed.includes(update))

    if (!isValidPatch) {
        return res.status(400).send({
            message: 'One or more properties are not supported.'
        })
    }

	try {
		const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
		await user.save()
		const profile = await user.makeProfile()
		res.send({
			profile,
			message: 'Account updated!'
		})
	} catch (e) {
		console.log(e)
		res.status(400).send(e)
	}
})

router.delete('/api/me/delete', authentification, async (req, res) => {
	try {
		await req.user.remove()
		res.send({
			message: 'Removing account',
			account: req.user,
		})
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/api/me/wallets', authentification, async (req, res) => {
	await req.user.populate({
		path: 'wallet',
	})
	res.send(req.user.wallet)
})

router.get('/api/me/favorites', authentification, async (req, res) => {
	await req.user.populate({
		path: 'favorite',
	})
	res.send(req.user.favorite)
})

router.get('/api/me/watchlists', authentification, async (req, res) => {
	await req.user.populate({
		path: 'watchlist',
	})
	res.send(req.user.watchlist)
})

router.patch('/api/me/sessions/purge', authentification, async (req, res) => {
	try {
		let activeSessions = req.user.sessions.length
		req.user.sessions = req.user.sessions.find((session) => session.session === req.token)
		await req.user.save()
		res.send({
			message: `Successfully purged all other sessions!`,
			purged: activeSessions - req.user.sessions.length,
		})
	} catch (e) {
		res.send(500).send()
	}
})

module.exports = router
