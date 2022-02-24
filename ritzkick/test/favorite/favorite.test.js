const request = require('supertest')
const mongoose = require('mongoose')
const server = require('../../application/app')
const User = require('../../db/model/user')
const Favorite = require('../../db/model/favorite')
const jwt = require('jsonwebtoken')

const testId = new mongoose.Types.ObjectId()
const testFavId = new mongoose.Types.ObjectId()

const testUser = {
	_id: testId,
	email: 'test@mail.com',
	username: 'test_account',
	password: 'HardP@ssw0rd213',
	sessions: [
		{
			session: jwt.sign({ _id: testId }, process.env.JWTSECRET)
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
	await user.save()
	token = await user.makeAuthToken()

	user = await new User(dummy)
	await user.save()
	otherToken = await user.makeAuthToken()

	await new Favorite(testFavorite).save()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe('Unauthenticated test cases', () => {
	test(`'BAD REQUEST' you cannot add a favorite if you're not authenticated`, async () => {
		await request(server).post('/api/favorite').send().expect(401)
	})

	test(`'BAD REQUEST' you cannot delete a favorite if you're not authenticated`, async () => {
		await request(server).delete('/api/favorite').send().expect(401)
	})
})

describe(`Create tests cases /api/favorite`, () => {
	const URL = '/api/favorite'

	test(`'CONFLICTS REQUEST' you cannot add twice something in your favorite`, async () => {
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

	test(`'CREATE REQUEST' you can add in your favorite something that you don't have`, async () => {
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

	test(`'NOT FOUND REQUEST' you cannot remove a specific favorite if you already have it in your list`, async () => {
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

	test(`'SUCCESS REQUEST' you cannot remove a specific favorite if you already have it in your list`, async () => {
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
