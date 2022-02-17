const express = require('express')
const Reset = require('../../db/model/reset')
const validator = require('validator').default
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../db/model/user')
const emailSender = require('../../application/email/email')
const axios = require('axios').default

router.post('/api/reset', async (req, res) => {
    try {
        const { email } = req.body
        if (!validator.isEmail(email)) {
            throw new Error('Please provide a valid email.')
        }
        const user = await User.findOne({ email })
        if (user) {
            const _ = await dropIfExist(user.email)
            // Maybe do something if it exists...
            const reset = new Reset({ email })
            await reset.save()
            const resetLink = await reset.makeResetToken()
            // Email sent with the valid url for forgot password.
            // This is just a dummy value.
            let url = `http://localhost:3000/${resetLink}`
            emailSender.sendResetPasswordEmail(user.email, url)
            return res.status(201).send({
                token: resetLink
            })
        }
        res.status(201).send()
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

router.get('/api/reset/verify/:jwt', async (req, res) => {
    try {
        const token = req.params.jwt
        const decoded = jwt.verify(token, process.env.JWTSECRET)
        const { email, secret } = decoded
        const reset = await Reset.findOne({ email, secret })
        if (!reset) {
            throw new Error('Token may be outdated.')
        }

        const decodedTokenStored = jwt.verify(reset.resetToken, process.env.JWTSECRET)

        const modified = !Object.keys(decoded).every(key => {
            return (decoded[key] === decodedTokenStored[key])
        })

        if (modified) {
            throw new Error('Token is corrupted')
        }

        reset.attemps = parseInt(reset.attemps) + 1
        await reset.save()
        res.send()
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})

router.post('/api/reset/redeem', async (req, res) => {
    try {
        const { resetToken, password, confirmation } = req.body

        if (!resetToken || !password || !confirmation) {
            throw new Error('Please provide the minimum information to make the request')
        }

        if (validator.isEmpty(String(resetToken).trim()) || validator.isEmpty(String(password).trim()) || validator.isEmpty(String(confirmation).trim())) {
            throw new Error('Please provide values to your fields')
        }

        if (password !== confirmation) {
            throw new Error('Passwords do not match')
        }

        let response = await axios.get(`${process.env.SSL == 'false' ? 'http' : 'https' }://${process.env.NEXT_PUBLIC_HTTPS}:${process.env.NEXT_PUBLIC_PORT}/api/reset/verify/${resetToken}`).catch(e => { return e })

        if (response.isAxiosError) {
            throw new Error('Cannot update the profile.')
        }

        const decoded = jwt.verify(resetToken, process.env.JWTSECRET)
        const { email } = decoded
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error('No user matches the email')
        }

        user['password'] = password
        user.sessions = []
        await user.save()

        await Reset.findOneAndDelete({ email })

        res.send()
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
})


const dropIfExist = async (email) => {
    return await Reset.findOneAndDelete({ email })
}

module.exports = router
