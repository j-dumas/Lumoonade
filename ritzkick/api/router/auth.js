const express = require('express')
const User = require('../../db/model/user')
const authentication = require('../middleware/auth')
const router = express.Router()

/**
 * POST /api/auth/login
 * @summary The default endpoint for authentification
 * @tags authentification 
 * @return {object} 200 - success
 * @return {string} 400 - error
 */
router.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        const token = await user.makeAuthToken()
        res.send({
            user,
            token
        })
    } catch(e) {
        res.status(400).send(e)
    }
})

/**
 * POST /api/auth/register
 * @summary The default endpoint for account creation
 * @tags authentification 
 * @return {object} 201 - created
 * @return {string} 400 - error
 */
router.post('/api/auth/register', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.makeAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }
})

/**
 * POST /api/auth/logout
 * @summary The default endpoint for logout purpuses
 * @tags authentification 
 * @return {object} 200 - success
 * @return {string} 400 - error
 */
router.post('/api/auth/logout', authentication, async (req, res) => {
    try {
        req.user.sessions = req.user.sessions.filter(session => session.session !== req.token)
        await req.user.save()
        res.send({
            message: 'Succesfully logout!'
        })
    } catch(e) {
        res.status(500).send()
    }
})

/**
 * POST /api/auth/forgot
 * @summary The default endpoint for "forget password" 
 * @tags authentification 
 * @return {object} 200 - success
 * @return {string} 500 - server error
 */
router.post('/api/auth/forgot', async (req, res) => {
    try {
        const { email } = req.body
        // @Todo need to find a user related to the email
        res.send({
            message: `Notification sent to ${email}`
        })
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router