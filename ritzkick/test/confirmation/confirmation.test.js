const Confirmation = require('../../db/model/confirmation')
const User = require('../../db/model/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../app/app')
const request = require('supertest')

const paths = require('../../api/routes.json')

const fs = require('fs')
const privateKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-priv-key.pem`)

const jwtOptions = {
	algorithm: 'ES256',
	subject: 'Lumoonade Auth',
	issuer: 'localhost',
	audience: 'localhost'
}

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

describe(`Creation confirmation test cases for ${paths.confirmation.default}`, () => {
	const URL = paths.confirmation.default

	test(`I should not be able to send an empty body for the confirmation creation process.`, async () => {
		await request(server).post(URL).send().expect(400)
	})

	test(`I should not be able to provide an invalid email in the body (EMPTY)`, async () => {
		await request(server).post(URL).send({ email: '' }).expect(400)
	})

	test(`I should not be able to provide an invalid email format.`, async () => {
		await request(server).post(URL).send({ email: 'a@a.a' }).expect(400)
	})

	test(`I should not be able to reconfirm your email if I've already confirmed it.`, async () => {
		let confirmations = await Confirmation.find({})
		expect(confirmations.length).toBe(0)
		const user = await User.findOne({ email: tempUser.email })
		await user.verified()
		await request(server).post(URL).send({ email: tempUser.email }).expect(409)
		confirmations = await Confirmation.find({})
		expect(confirmations.length).toBe(0)
	})

	test(`I should be able to create a confirmation request if the email is a valid format.`, async () => {
		let confirmations = await Confirmation.find({})
		expect(confirmations.length).toBe(0)
		await request(server).post(URL).send({ email: 'email@mail.com' }).expect(201)
		confirmations = await Confirmation.find({})
		expect(confirmations.length).toBe(1)
	})
})

describe(`Validation test cases for ${paths.confirmation.verify}:jwt`, () => {
	const URL = paths.confirmation.verify

	test(`I should not be able to verify if the token doesn't match any confirmation`, async () => {
		const customJWT = jwt.sign({ email: 'any@email.com', secret: 123123123 }, privateKey, jwtOptions)
		await request(server)
			.get(URL + customJWT)
			.send()
			.expect(409)
	})

	test(`I should be able to can validate the token if it exists.`, async () => {
		let confirmations = await Confirmation.find({})
		expect(confirmations.length).toBe(0)
		let user = await User.findOne({ email: tempUser.email })
		expect(user.validatedEmail).toBeFalsy()

		await request(server).post(paths.confirmation.default).send({ email: tempUser.email }).expect(201)
		confirmations = await Confirmation.find({})
		expect(confirmations.length).toBe(1)

		confirmation = await Confirmation.findOne({ email: tempUser.email })
		expect(confirmation).toBeDefined()
		let token = confirmation.confirmationToken
		await request(server)
			.get(URL + token)
			.send()
			.expect(200)

		confirmations = await Confirmation.find({})
		expect(confirmations.length).toBe(0)
		user = await User.findOne({ email: tempUser.email })
		expect(user.validatedEmail).toBeTruthy()
	})
})
