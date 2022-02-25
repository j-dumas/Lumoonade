const Confirmation = require('../../db/model/confirmation')
const User = require('../../db/model/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../application/app')
const request = require('supertest')

let tempUser

beforeEach(async () => {
    tempUser = {
        email: 'joe@mail.com',
        password: 'aspdaspdapsdapd',
        username: 'masdkasdmaksd'
    }
    await Confirmation.deleteMany()
    await User.deleteMany()
    await new User(tempUser).save()
})

afterAll((done) => {
    mongoose.connection.close()
    done()
})

describe(`Creation confirmation test cases for /api/confirmations`, () => {

    const URL = '/api/confirmations'

    test(`'BAD REQUEST' you cannot send an empty body for the confirmation creation process.`, async () => {
        await request(server).post(URL).send().expect(400)
    })

    test(`'BAD REQUEST' you can't provide an invalid email in the body (EMPTY)`, async () => {
        await request(server).post(URL).send({ email: '' }).expect(400)
    })

    test(`'BAD REQUEST' you can't provide an invalid email format.`, async () => {
        await request(server).post(URL).send({ email: 'a@a.a' }).expect(400)
    })

    test(`'BAD REQUEST' you can't reconfirm your email if your already confirmed it.`, async () => {
        let confirmations = await Confirmation.find({})
        expect(confirmations.length).toBe(0)
        const user = await User.findOne({ email: tempUser.email })
        await user.verified()
        await request(server).post(URL).send({ email: tempUser.email }).expect(400)
        confirmations = await Confirmation.find({})
        expect(confirmations.length).toBe(0)
    })

    test(`'CREATION REQUEST' you can create a confirmation request if the email is a valid format.`, async () => {
        let confirmations = await Confirmation.find({})
        expect(confirmations.length).toBe(0)
        await request(server).post(URL).send({ email: 'email@mail.com' }).expect(201)
        confirmations = await Confirmation.find({})
        expect(confirmations.length).toBe(1)
    })

})

describe(`Validation test cases for /api/confirmation/verify/:jwt`, () => {
    
    const URL = '/api/confirmation/verify/'

    test(`'BAD REQUEST' fail to verify if the token doesn't match any confirmation`, async () => {
        const customJWT = jwt.sign({ email: 'any@email.com', secret: 123123123 }, process.env.RESET_JWT_SECRET)
        await request(server).get(URL + customJWT).send().expect(400)
    })

    test(`'VALIDATED REQUEST' you can validate the token if it exists.`, async () => {
        let confirmations = await Confirmation.find({})
        expect(confirmations.length).toBe(0)
        let user = await User.findOne({ email: tempUser.email })
        expect(user.validatedEmail).toBeFalsy()

        await request(server).post('/api/confirmations').send({ email: tempUser.email }).expect(201)
        confirmations = await Confirmation.find({})
        expect(confirmations.length).toBe(1)

        confirmation = await Confirmation.findOne({ email: tempUser.email })
        expect(confirmation).toBeDefined()
        let token = confirmation.confirmationToken
        await request(server).get(URL + token).send().expect(200)

        confirmations = await Confirmation.find({})
        expect(confirmations.length).toBe(0)
        user = await User.findOne({ email: tempUser.email })
        expect(user.validatedEmail).toBeTruthy()
    })
})