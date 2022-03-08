const request = require('supertest')
const mongoose = require('mongoose')
const server = require('../../app/app')
const User = require('../../db/model/user')
const Favorite = require('../../db/model/favorite')
const jwt = require('jsonwebtoken')

const testId = new mongoose.Types.ObjectId()
const testFavId = new mongoose.Types.ObjectId()

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
	],
	favorite_list: [
		{
			favorite: testFavId
		}
	]
}

const testFavorite = {
	_id: testFavId,
	owner: testId,
	slug: 'eth'
}

let token, otherToken

beforeEach(async () => {
	let dummy = {
		email: 'test123@mail.com',
		username: 'test123_account',
		password: 'HardP@ssw0rd213'
	}

	await User.deleteMany()
	await Favorite.deleteMany()
	let user = await new User(testUser)
	await user.verified()
	token = await user.makeAuthToken('localhost')

	user = await new User(dummy)
	await user.verified()
	otherToken = await user.makeAuthToken('localhost')

	await new Favorite(testFavorite).save()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe('Unauthenticated test cases', () => {
	test(`I should not be able to add a favorite if I'm not authenticated`, async () => {
		await request(server).post('/api/favorite').send().expect(401)
	})

	test(`I should not be able to delete a favorite if I'm not authenticated`, async () => {
		await request(server).delete('/api/favorite').send().expect(401)
	})
})

describe(`Create tests cases /api/favorite`, () => {
	const URL = '/api/favorite'

	test(`I should not be able to add twice something in my favorite`, async () => {
		let favorites = await Favorite.find({})
		expect(favorites.length).toBe(1)
		await request(server)
			.post(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send({
				slug: testFavorite.slug
			})
			.expect(409)

		favorites = await Favorite.find({})
		expect(favorites.length).toBe(1)
	})

	test(`I should be able to add in my favorite something that I don't have`, async () => {
		let favorites = await Favorite.find({})
		let user = await User.findById(testId)
		expect(user.favorite_list.length).toBe(1)
		expect(favorites.length).toBe(1)
		await request(server)
			.post(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send({
				slug: testFavorite.slug + 'a'
			})
			.expect(201)

		favorites = await Favorite.find({})
		expect(favorites.length).toBe(2)
		user = await User.findById(testId)
		expect(user.favorite_list.length).toBe(2)
	})
})

describe(`Delete test cases /api/favorite`, () => {
	const URL = '/api/favorite'

	test(`I should not be able to remove a specific favorite if I don't have it in my list`, async () => {
		let favorites = await Favorite.find({})
		expect(favorites.length).toBe(1)

		// The slug doesn't matter because the user doesn't have any favorite/
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send({
				slug: 'eth'
			})
			.expect(404)

		favorites = await Favorite.find({})
		expect(favorites.length).toBe(1)
	})

	test(`I should be able to remove a specific favorite if I have it in my list`, async () => {
		let favorites = await Favorite.find({})
		expect(favorites.length).toBe(1)
		let user = await User.findById(testId)
		expect(user.favorite_list.length).toBe(1)

		// The slug doesn't matter because the user doesn't have any favorite/
		const a = await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send({
				slug: testFavorite.slug
			})
			.expect(204)

		user = await User.findById(testId)
		expect(user.favorite_list.length).toBe(0)
		favorites = await Favorite.find({})
		expect(favorites.length).toBe(0)
	})
})
