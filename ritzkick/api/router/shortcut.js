const express = require('express')
const Shortcut = require('../../db/model/shortcut')
const router = express.Router()

router.get('/redirect/:id', async (req, res) => {
	try {
		const shortcut = await Shortcut.findOne({ _id: req.params.id })
		if (!shortcut) {
			throw new Error()
		}
		const url = shortcut.url
		await handleShortcuts(shortcut)
		res.redirect(url)
	} catch (e) {
		res.redirect('/')
	}
})

router.post('/api/redirects', async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new Error('Please provide a body.')
		}
		const baseURL = `https://${process.env.URL}:${process.env.PORT}/redirect`
		const existsShort = await Shortcut.findOne({ url: req.body.url })
		if (existsShort) {
			return res.send({
				url: `${baseURL}/${existsShort._id}`
			})
		}
		let shortUrlBody = {
			...req.body
		}
		if (shortUrlBody.visits) {
			throw new Error('You cannot set visits')
		}
		const shorturl = new Shortcut(shortUrlBody)
		await shorturl.save()
		const url = `${baseURL}/${shorturl._id}`
		res.status(201).send({
			url
		})
	} catch (e) {
		res.status(400).send({
			message: e.message
		})
	}
})

const handleShortcuts = async (shortcut) => {
	shortcut.visits = parseInt(shortcut.visits) + 1
	if (shortcut.destroyable && shortcut.maxUse <= shortcut.visits) {
		return await Shortcut.findOneAndRemove({ _id: shortcut._id })
	}
	await shortcut.save()
}

module.exports = router
