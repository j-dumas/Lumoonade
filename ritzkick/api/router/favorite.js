const express = require('express')
const mongoose = require('mongoose')
const Favorite = require('../../db/model/favorite')
const router = express.Router()

router.get('/api/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.find({})
        if (!favorites || favorites.length === 0) {
            throw new Error('Unable to find favorites.')
        }

        res.send(favorites)
    } catch(e) {
        res.status(500).send({
            message: e.message
        })
    }
})

module.exports = router