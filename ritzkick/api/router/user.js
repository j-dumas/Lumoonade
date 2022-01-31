const express = require('express')
const mongoose = require('mongoose')
const User = require('../../db/model/user')
const router = express.Router()

router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({})
        if (!users || users.length === 0) {
            throw new Error('Unable to find users.')
        }

        res.send(users)
    } catch(e) {
        res.status(500).send({
            message: e.message
        })
    }
})

router.delete('/api/:id/delete', async (req, res) => {
    res.send('Not yet implemented.')
})

router.get('/api/:id/wallets', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new Error('Please provide a valid Id.')
        }
        
        const user = await User.findById(req.params.id)
        if (!user) {
            throw new Error('Unable to find user.')
        }
        await user.populate({
            path: 'wallet'
        })
        res.send(user.wallet)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/api/:id/favorites', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new Error('Please provide a valid Id.')
        }
        
        const user = await User.findById(req.params.id)
        if (!user) {
            throw new Error('Unable to find user.')
        }
        await user.populate({
            path: 'favorite'
        })
        res.send(user.favorite)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/api/:id/watchlists', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw new Error('Please provide a valid Id.')
        }
        
        const user = await User.findById(req.params.id)
        if (!user) {
            throw new Error('Unable to find user.')
        }
        await user.populate({
            path: 'watchlist'
        })
        res.send(user.watchlist)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router