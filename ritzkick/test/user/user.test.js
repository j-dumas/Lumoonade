const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../app/app')
const User = require('../../db/model/user')
const Wallet = require('../../db/model/wallet')
const Favorite = require('../../db/model/favorite')
const Watchlist = require('../../db/model/watchlist')

const paths = require('../../api/routes.json')

// ---------------------------------------------
//        Section for the user generation
// ---------------------------------------------
const testIdOne = new mongoose.Types.ObjectId()
const testIdOneSession = new mongoose.Types.ObjectId()
const testIdTwo = new mongoose.Types.ObjectId()
const testIdTwoSession = new mongoose.Types.ObjectId()

const fs = require('fs')
const privateKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-priv-key.pem`)

const jwtOptions = {
	algorithm: 'ES256',
	subject: 'Lumoonade Auth',
	issuer: 'localhost',
	audience: 'localhost'
}

const tokenForUserOne = jwt.sign({ _id: testIdOne }, privateKey, jwtOptions)
const tokenForUserTwo = jwt.sign({ _id: testIdTwo }, privateKey, jwtOptions)
const tokenForUserTwoTwo = jwt.sign({ _id: testIdTwo }, privateKey, jwtOptions)

// ---------------------------------------------
//      Section for the Wallet generation
// ---------------------------------------------
const walletIdOne = new mongoose.Types.ObjectId()
const walletIdTwo = new mongoose.Types.ObjectId()

// ---------------------------------------------
//     Section for the Favorite generation
// ---------------------------------------------
const favoriteIdOne = new mongoose.Types.ObjectId()
const favoriteIdTwo = new mongoose.Types.ObjectId()

// ---------------------------------------------
//     Section for the Watchlist generation
// ---------------------------------------------
const watchlistIdOne = new mongoose.Types.ObjectId()
const watchlistIdTwo = new mongoose.Types.ObjectId()

const testUserOne = {
	_id: testIdOne,
	email: 'testone@mail.com',
	username: 'test_account_one',
	password: 'HardP@ssw0rd213',
	favorite_list: [
		{
			favorite: favoriteIdOne
		}
	],
	wallet_list: [
		{
			wallet: walletIdOne
		}
	],
	watchlist_list: [
		{
			watch: watchlistIdOne
		}
	],
	sessions: [
		{
			_id: testIdOneSession,
			session: tokenForUserOne
		}
	]
}

const testUserTwo = {
	_id: testIdTwo,
	email: 'testtwo@mail.com',
	username: 'test_account_two',
	password: 'HardP@ssw0rd213',
	favorite_list: [
		{
			favorite: favoriteIdTwo
		}
	],
	wallet_list: [
		{
			wallet: walletIdTwo
		}
	],
	watchlist_list: [
		{
			watch: watchlistIdTwo
		}
	],
	sessions: [
		{
			_id: testIdTwoSession,
			session: tokenForUserTwo
		},
		{
			_id: new mongoose.Types.ObjectId(),
			session: tokenForUserTwoTwo
		}
	]
}

const walletTestOne = {
	_id: walletIdOne,
	owner: testIdOne,
	asset: new mongoose.Types.ObjectId()
}

const walletTestTwo = {
	_id: walletIdTwo,
	owner: testIdTwo,
	asset: new mongoose.Types.ObjectId()
}

const favoriteTestOne = {
	_id: favoriteIdOne,
	owner: testIdOne,
	slug: 'btc'
}

const favoriteTestTwo = {
	_id: favoriteIdTwo,
	owner: testIdTwo,
	slug: 'eth'
}

const watchlistTestOne = {
	_id: watchlistIdOne,
	owner: testIdOne,
	slug: 'eth',
	parameter: 'gte',
	target: 0
}

const watchlistTestTwo = {
	_id: watchlistIdTwo,
	owner: testIdTwo,
	slug: 'btc',
	parameter: 'lte',
	target: 0
}

beforeEach(async () => {
	await User.deleteMany()
	await Wallet.deleteMany()
	await Favorite.deleteMany()
	await Watchlist.deleteMany()
	await new User(testUserOne).verified()
	await new User(testUserTwo).verified()
	await new Wallet(walletTestOne).save()
	await new Wallet(walletTestTwo).save()
	await new Favorite(favoriteTestOne).save()
	await new Favorite(favoriteTestTwo).save()
	await new Watchlist(watchlistTestOne).save()
	await new Watchlist(watchlistTestTwo).save()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe(`Get details tests cases ${paths.user.default}`, () => {
	test('I should not be able to access my account "details" without being authenticated', async () => {
		await request(server).get(paths.user.default).send().expect(401)
	})

	test(`I should not be able to access someone else account's details and only get my details`, async () => {
		const res = await request(server)
			.get(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		const body = res.body
		// Other account details
		expect(body.email).not.toBe(testUserTwo.email)
		expect(body.username).not.toBe(testUserTwo.username)
		// Current account detauls
		expect(body.email).toBe(testUserOne.email)
		expect(body.username).toBe(testUserOne.username)
	})
})

describe(`Get details tests cases ${paths.user.summary}`, () => {
	test('I should not be able to access my profile without being authenticated', async () => {
		await request(server).get(paths.user.summary).send().expect(401)
	})

	test('I should not be able to access my profile without being authenticated', async () => {
		await request(server).get(paths.user.summary).send().expect(401)
	})

	test(`I should not be able to access someone else account's details and only get my details`, async () => {
		const res = await request(server)
			.get(paths.user.summary)
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		const body = res.body
		// Other account details
		expect(body.email).not.toBe(testUserTwo.email)
		expect(body.username).not.toBe(testUserTwo.username)
		// Current account detauls
		expect(body.email).toBe(testUserOne.email)
		expect(body.username).toBe(testUserOne.username)
	})
})

describe(`Delete tests cases ${paths.user.default}`, () => {
	test('I should not be able to delete my account without being authenticated', async () => {
		await request(server).delete(paths.user.default).send().expect(401)
	})

	test(`I should be able to delete my account`, async () => {
		let currentAccounts = await User.find({})
		expect(currentAccounts.length).toBe(2)
		await request(server)
			.delete(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		currentAccounts = await User.find({})
		expect(currentAccounts.length).toBe(1)

		expect(currentAccounts[0].email).toBe(testUserTwo.email)
		expect(currentAccounts[0].username).toBe(testUserTwo.username)
	})
})

describe(`Wallets tests cases ${paths.wallets.all}`, () => {
	test('I should not be able to access my wallets without being authenticated', async () => {
		await request(server).get(paths.wallets.all).send().expect(401)
	})

	test(`I should not be able to access someone else account's wallet details and only get my wallet details`, async () => {
		const res = await request(server)
			.get(paths.wallets.all)
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		const body = res.body
		const wallets = body.wallets

		expect(body.count).toBe(1)
		expect(wallets[0].owner == testIdOne).toBeTruthy()
		expect(wallets[0]._id == walletIdOne).toBeTruthy()
	})
})

describe(`Favorites tests cases ${paths.favorites.all}`, () => {
	test('I should not be able to access my favorites without being authenticated', async () => {
		await request(server).get(paths.favorites.all).send().expect(401)
	})

	test(`I should not be able to access someone else account's favorite details and only get my favorite details`, async () => {
		const res = await request(server)
			.get(paths.favorites.all)
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		const body = res.body
		const favorites = body.favorites

		expect(body.count).toBe(1)
		expect(favorites[0].owner == testIdOne).toBeTruthy()
		expect(favorites[0]._id == favoriteIdOne).toBeTruthy()
	})
})

describe(`Watchlists tests cases ${paths.alerts.all}`, () => {
	test('I should not be able to access my watchlists without being authenticated', async () => {
		await request(server).get(paths.alerts.all).send().expect(401)
	})

	test(`I should not be able to access someone else account's watchlist details and only get my watchlist details`, async () => {
		const res = await request(server)
			.get(paths.alerts.all)
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		const body = res.body
		const watchlists = body.watchlists

		expect(body.count).toBe(1)
		expect(watchlists[0].owner == testIdOne).toBeTruthy()
		expect(watchlists[0]._id == watchlistIdOne).toBeTruthy()
	})
})

describe(`Session purge tests cases ${paths.user['purge-sessions']}`, () => {
	test('I should not be able to purge all my active sessions without being authenticated', async () => {
		await request(server).patch(paths.user['purge-sessions']).send().expect(401)
	})

	test(`I want to purge all the active session except mine, should get 0 purged because I only logged once.`, async () => {
		const res = await request(server)
			.patch(paths.user['purge-sessions'])
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		const body = res.body

		expect(body.purged).toBe(0)
	})

	test(`I want to purge all the active session except mine, should get 0 purged because I only logged once.`, async () => {
		const res = await request(server)
			.patch(paths.user['purge-sessions'])
			.set({ Authorization: `Bearer ${tokenForUserOne}` })
			.send()
			.expect(200)
		const body = res.body

		expect(body.purged).toBe(0)
		expect(testUserOne.sessions[0].session).toBe(tokenForUserOne)
	})

	// test(`I want to purge all the active session except mine, should get 1 purged because I logged twice.`, async () => {
	// 	const res = await request(server)
	// 		.patch(paths.user['purge-sessions'])
	// 		.set({ Authorization: `Bearer ${tokenForUserTwo}` })
	// 		.send()
	// 		.expect(200)
	// 	const body = res.body

	// 	expect(body.purged).toBe(1)
	// 	expect(testUserTwo.sessions[0].session).toBe(tokenForUserTwoTwo)
	// })
})

describe(`Update tests cases ${paths.user.default}`, () => {
	test('I should not be able to modify my account without being authenticated', async () => {
		await request(server).patch(paths.user.default).send().expect(401)
	})

	test(`I want to modify my password when I'm authenticated`, async () => {
		const CURRENT_PASSWORD = testUserTwo.password
		await request(server)
			.patch(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserTwo}`, 'Content-Type': 'application/json' })
			.send(
				JSON.stringify({
					oldPassword: CURRENT_PASSWORD,
					newPassword: 'jon324c9-2308n4c9023904'
				})
			)
			.expect(200)
		const user = await User.findOne({ _id: testUserTwo._id })

		expect(user.password).not.toBe(CURRENT_PASSWORD)
	})

	test(`I cannot set an empty password as the new one`, async () => {
		const CURRENT_PASSWORD = testUserTwo.password
		await request(server)
			.patch(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserTwo}`, 'Content-Type': 'application/json' })
			.send(JSON.stringify({ oldPassword: CURRENT_PASSWORD, newPassword: '' }))
			.expect(409)
	})

	test(`I cannot set an empty password (with alot of spaces) as the new one`, async () => {
		const CURRENT_PASSWORD = testUserTwo.password
		await request(server)
			.patch(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserTwo}`, 'Content-Type': 'application/json' })
			.send(JSON.stringify({ oldPassword: CURRENT_PASSWORD, newPassword: '      ' }))
			.expect(400)
	})

	test(`I cannot implicitly set a new password without providing the oldPassword and the newPassword`, async () => {
		const CURRENT_PASSWORD = testUserTwo.password
		await request(server)
			.patch(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserTwo}`, 'Content-Type': 'application/json' })
			.send(JSON.stringify({ password: CURRENT_PASSWORD }))
			.expect(409)
	})

	test(`I want to modify my username when I'm authenticated`, async () => {
		const CURRENT_USERNAME = testUserTwo.username
		await request(server)
			.patch(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserTwo}`, 'Content-Type': 'application/json' })
			.send(JSON.stringify({ username: 'jonny' }))
			.expect(200)
		const user = await User.findOne({ _id: testUserTwo._id })

		expect(user.username).not.toBe(CURRENT_USERNAME)
	})

	test(`I can modify my whole profile in one request (username, oldPass, newPass)`, async () => {
		const CURRENT_USERNAME = testUserTwo.username
		const CURRENT_PASSWORD = testUserTwo.password
		await request(server)
			.patch(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserTwo}`, 'Content-Type': 'application/json' })
			.send(
				JSON.stringify({
					username: 'jonny',
					oldPassword: CURRENT_PASSWORD,
					newPassword: 'test123213'
				})
			)
			.expect(200)
		const user = await User.findOne({ _id: testUserTwo._id })

		expect(user.username).not.toBe(CURRENT_USERNAME)
		expect(user.password).not.toBe(CURRENT_PASSWORD)
	})

	test(`I want to modify my email when I'm authenticated`, async () => {
		const CURRENT_EMAIL = testUserTwo.email
		await request(server)
			.patch(paths.user.default)
			.set({ Authorization: `Bearer ${tokenForUserTwo}`, 'Content-Type': 'application/json' })
			.send(JSON.stringify({ email: 'someemail@mail.com' }))
			.expect(409)
		const user = await User.findOne({ _id: testUserTwo._id })
		expect(user.email).toBe(CURRENT_EMAIL)
	})
})
