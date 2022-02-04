const express = require('express')
const mongoose = require('mongoose')
const User = require('../../db/model/user')
const authentification = require('../middleware/auth')

const router = express.Router()

router.get('/api/me', authentification, async (req, res) => {
	res.send(req.user)
})

module.exports = router