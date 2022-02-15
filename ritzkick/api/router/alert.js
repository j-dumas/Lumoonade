const express = require('express')
const router = express.Router()
const Watchlist = require('../../db/model/watchlist')
const { sendError, NotFoundHttpError } = require('../../utils/http_errors')
const auth = require('../middleware/auth')

router.post('/api/alerts', auth, async (req, res) => {
    try {
        const user = req.user
        let queryData = {
            owner: user._id,
            ...req.body
        }

        const watchlist = new Watchlist(queryData)
        await watchlist.save()
        await req.user.addWatchlistAlertAndSave(watchlist)
        res.status(201).send(watchlist)
    } catch (e) {
        await sendError(res, e)
    }
})

router.put('/api/alerts/update', auth, async (req, res) => {
    try {
        let updates = Object.keys(req.body)
        if (updates.length === 0) throw new Error('Please provide informations to modify')
        const user = req.user
        const { id } = req.body
        const alert = await Watchlist.findOne({_id: id, owner: user._id.toString() })
        if (!alert) {
            throw new Error('Could not find the alert to modify')
        }

        updates = updates.filter(update => update !== 'id')
        const allowed = ['parameter', 'target']
        const validUpdate = updates.every((update) => allowed.includes(update))
        if (!validUpdate) throw new Error('One or more properties are not supported.')

        updates.forEach(update => {
            if (update.toLowerCase().includes('parameter')) {
                let validModification = ['lte', 'gte']
                let content = req.body[update].toLowerCase()
                let found = validModification.find(modification => modification === content)
                if (!found) {
                    throw new Error('Possible values are ' + validModification)
                }
            }
            alert[update] = req.body[update]
        })
        await alert.save()

        res.send({
            message: 'Alert updated!',
            alert,
        })
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

router.delete('/api/alerts/delete', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'watchlist'
        })

        const alertId = req.body.id
        const exists = req.user.watchlist.find(w => {
            return w._id.toString() === alertId
        })

        if (!exists) {
            throw new NotFoundHttpError('Could not found the alert')
        }

        const alert = await Watchlist.findOneAndRemove({ _id: req.body.id, owner: req.user._id.toString() })

        if (!alert) {
            throw new NotFoundHttpError('The alert seems to be already removed.')
        }

        await req.user.removeWatchlistAlertAndSave(alert._id)

        res.send({
            message: 'Alert successfully removed.',
            alert
        })
    } catch (e) {
        sendError(res, e)
    }
})

module.exports = router