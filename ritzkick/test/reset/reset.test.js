const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../application/app')
const User = require('../../db/model/user')
const Reset = require('../../db/model/reset')
const axios = require('axios').default


const email = require('../../application/email/email')
const validSecret = process.env.RESET_JWT_SECRET

jest.mock('axios')

let sendResetPasswordEmailCalled = false
email.sendResetPasswordEmail = () => {
    sendResetPasswordEmailCalled = true
}

let testUser, testReset, redeemConfig

const resetEmail = 'anemail@mail.com'

beforeEach(async () => {
    sendResetPasswordEmailCalled = false
    testUser = {
        email: 'dummy@mail.com',
        username: 'testAccount',
        password: 'HardP@ssw0rd213',
        sessions: [
            {
                session: jwt.sign({ _id: new mongoose.Types.ObjectId() }, validSecret)
            }
        ]
    }

    testReset = {
        email: resetEmail
    }

    redeemConfig = {
        resetToken: '',
        password: '',
        confirmation: '',
    }

	await User.deleteMany()
	await Reset.deleteMany()
	await new User(testUser).save()
    const resetFake = new Reset(testReset)
    await resetFake.makeResetToken()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe('Tests for the route /api/reset', () => {
    const BASE = '/api/reset'
    test(`'BAD REQUEST' if I don't send any email to reset the password`, async () => {
        await request(server).post(BASE).send().expect(400)
    })

    test(`'BAD REQUEST' if I send an invalid email to reset the password (empty string)`, async () => {
        await request(server).post(BASE).send({
            email: ' '
        }).expect(400)
    })

    test(`'BAD REQUEST' if I send an invalid email to reset the password (bad email format)`, async () => {
        await request(server).post(BASE).send({
            email: 'a@a.a'
        }).expect(400)
    })

    test(`'CREATION REQUEST' if I send a valid email to reset the password (doesn't need to exist)`, async () => {
        await request(server).post(BASE).send({
            email: 'email@mail.com'
        }).expect(201)

        // Should not have sent the email if this email does't exist in the database
        expect(sendResetPasswordEmailCalled).toBeFalsy()

        // Reset link created check (should not exist)
        const reset = await Reset.findOne({ email: testUser.email })
        expect(reset).toBeNull()
    })

    test(`'CREATION REQUEST' if I send a valid email to reset the password (exist in db)`, async () => {
        await request(server).post(BASE).send({
            email: testUser.email
        }).expect(201)

        // Should have sent the email if this email does exist in the database
        expect(sendResetPasswordEmailCalled).toBeTruthy()
        
        // Reset link created check
        const reset = await Reset.findOne({ email: testUser.email })
        expect(reset).toBeDefined()
        expect(reset).not.toBeNull()
    })

})

describe('Tests for the route /api/reset/verify/:jwt', () => {
    
    const BASE = '/api/reset/verify/'

    test(`'BAD REQUEST' if I send an invalid jwt token in the resquest (custom text)`, async () => {
        await request(server).get(BASE + 'invalidJWT').send().expect(400)
    })
    
    test(`'BAD REQUEST' if I send an invalid jwt token in the resquest (custom jwt made)`, async () => {
        const secret = 'topsecretvalue'
        const token = jwt.sign({ value: 'hey' }, secret)
        await request(server).get(BASE + token).send().expect(400)
    })

    test(`'BAD REQUEST' if I send an invalid jwt token that doesn't have a valid email and secret (custom jwt made)`, async () => {
        const secret = validSecret
        const token = jwt.sign({ email: 'email@mail.com', secret: 'shhh' }, secret)
        await request(server).get(BASE + token).send().expect(400)
    })

    test(`'SUCCESS REQUEST' if I send a valid jwt token that does have a valid email and secret (custom jwt made)`, async () => {
        let reset = await Reset.findOne({ email: resetEmail })
        console.log(reset)
        const attemps = reset.attemps
        expect(attemps).toBe(0)

        await request(server).get(BASE + reset.resetToken).send().expect(200)

        reset = await Reset.findOne({ email: resetEmail })
        const afterAttemps = reset.attemps
        expect(afterAttemps).toBe(1)
    })

})

describe('Tests for the route /api/reset/redeem', () => {
    
    const BASE = '/api/reset/redeem'
    const anyPassword = 'password1234'

    test(`'BAD REQUEST' if I don't send anything in the request`, async () => {
        await request(server).post(BASE).send().expect(400)
    })

    test(`'BAD REQUEST' if I send empty strings as the content`, async () => {
        await request(server).post(BASE).send(redeemConfig).expect(400)
    })

    test(`'BAD REQUEST' if I send none matching passwords (confirmation != password)`, async () => {
        redeemConfig.password = anyPassword
        redeemConfig.confirmation = redeemConfig.password + '!'
        await request(server).post(BASE).send(redeemConfig).expect(400)
    })

    test(`'BAD REQUEST' if I send any none working resetToken with matching passwords`, async () => {
        const secret = validSecret
        redeemConfig.resetToken = jwt.sign({ email: 'email@mail.com', secret: 'shhh' }, secret)
        redeemConfig.password = anyPassword
        redeemConfig.confirmation = redeemConfig.password

        // Mocking response
        axios.get.mockRejectedValueOnce(new Error())

        // The route is using /api/reset/verify to make sure the token is valid
        await request(server).post(BASE).send(redeemConfig).expect(400)
    })

    test(`'BAD REQUEST' if I use an invalid jwt token (no user bind to the reset token)`, async () => {
        const reset = await Reset.findOne({ email: resetEmail })
        redeemConfig.resetToken = reset.resetToken
        redeemConfig.password = anyPassword
        redeemConfig.confirmation = redeemConfig.password

        axios.get.mockResolvedValueOnce({ })

        // The route is using /api/reset/verify to make sure the token is valid
        await request(server).post(BASE).send(redeemConfig).expect(400)
    })

    test(`'SUCCESS REQUEST' if I use an invalid jwt token (no user bind to the reset token)`, async () => {
        // Creating the reset link in the database
        const resetReal = new Reset({ email: testUser.email })
        const token = await resetReal.makeResetToken()

        redeemConfig.resetToken = token
        redeemConfig.password = anyPassword
        redeemConfig.confirmation = redeemConfig.password

        axios.get.mockResolvedValueOnce({ })

        let user = await User.findOne({ email: testUser.email })
        const passwordBeforeModification = user.password
        const sessionsBeforeModification = user.sessions.length
        expect(sessionsBeforeModification).toBe(1)

        // The route is using /api/reset/verify to make sure the token is valid
        await request(server).post(BASE).send(redeemConfig).expect(200)
        user = await User.findOne({ email: testUser.email })
        const modifiedPassword = user.password
        const currentSessions = user.sessions.length
        
        expect(passwordBeforeModification).not.toBe(modifiedPassword)
        expect(currentSessions).toBe(0)
    })

})