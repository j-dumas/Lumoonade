const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../app/app')
const User = require('../../db/model/user')

const testId = new mongoose.Types.ObjectId()

const fs = require('fs')
const privateKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-priv-key.pem`)

const jwtOptions = {
	algorithm: 'ES256',
	subject: 'Lumoonade Auth',
	issuer: 'localhost',
	audience: 'localhost'
}

const testUser = {
	_id: testId,
	email: 'test@mail.com',
	username: 'test_account',
	password: 'HardP@ssw0rd213',
	sessions: [
		{
			session: jwt.sign({ _id: testId }, privateKey, jwtOptions)
		}
	]
}

let dummyData

beforeEach(async () => {
	dummyData = {
		email: 'dummy@mail.com',
		username: 'dummyName',
		password: 'HardP@ssw0rd213'
	}
	await User.deleteMany()
	await new User(testUser).save()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

test('Should be able to create a new user', async () => {
	await request(server).post('/api/auth/register').send(dummyData).expect(201)

	const user = await User.findOne({ email: dummyData.email })
	expect(user).not.toBeNull()
})

test('Should not be able to create a new account if the account already exists (same email)', async () => {
	dummyData.email = testUser.email
	await request(server).post('/api/auth/register').send(dummyData).expect(400)

	const users = await User.find({})
	expect(users.length).toBe(1)
})

test('Should not be able to log in if the user does not exist', async () => {
	const credentials = {
		email: dummyData.email,
		password: dummyData.password
	}
	await request(server).post('/api/auth/login').send(credentials).expect(404)
})

test('Should be able to log in if the user exists with a validate email', async () => {
	const credentials = {
		email: testUser.email,
		password: testUser.password
	}
	// Skipping the confirmation process.
	const user = await User.findOne({ email: credentials.email })
	await user.verified()

	await request(server).post('/api/auth/login').send(credentials).expect(200)
})

test('Should not be able to log in if the user exists with a not validated email', async () => {
	const credentials = {
		email: testUser.email,
		password: testUser.password
	}
	await request(server).post('/api/auth/login').send(credentials).expect(409)
})

test('Should not be able to logout if the user is not logged in.', async () => {
	await request(server).post('/api/auth/logout').expect(401)
})

test('Should be able to logout if the user is logged in.', async () => {
	const credentials = {
		email: testUser.email,
		password: testUser.password
	}
	// Skipping the confirmation process.
	const user = await User.findOne({ email: credentials.email })
	await user.verified()

	const res = await request(server).post('/api/auth/login').send(credentials).expect(200)
	const token = res.body.token
	await request(server)
		.post('/api/auth/logout')
		.set({ Authorization: `Bearer ${token}` })
		.send()
		.expect(200)

	// Making sure that you can't logout twice
	await request(server)
		.post('/api/auth/logout')
		.set({ Authorization: `Bearer ${token}` })
		.send()
		.expect(401)
})
