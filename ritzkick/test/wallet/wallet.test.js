const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../app/app')
const User = require('../../db/model/user')
const Wallet = require('../../db/model/wallet')
const Transaction = require('../../db/model/transaction')

const testId = new mongoose.Types.ObjectId()
const otherTestId = new mongoose.Types.ObjectId()
const testWalletId = new mongoose.Types.ObjectId()

const paths = require('../../api/routes.json')

const fs = require('fs')
const { Asset } = require('../../db/model/asset')
const privateKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-priv-key.pem`)

const jwtOptions = {
	algorithm: 'ES256',
	subject: 'Lumoonade Auth',
	issuer: 'localhost',
	audience: 'localhost'
}

const testUserSession = jwt.sign({ _id: new mongoose.Types.ObjectId() }, privateKey, jwtOptions)
const otherUserSession = jwt.sign({ _id: new mongoose.Types.ObjectId() }, privateKey, jwtOptions)

const testUser = {
	_id: testId,
	email: 'test@mail.com',
	username: 'test_account',
	password: 'HardP@ssw0rd213',
	sessions: [
		{
			_id: new mongoose.Types.ObjectId(),
			session: testUserSession
		}
	],
	wallet_list: [
		{
			wallet: testWalletId
		}
	]
}

const testUserWallet = {
	_id: testWalletId,
	owner: testId,
	asset: 'eth',
	amount: 22
}

let dummyData, token, configUpdate, otherToken

beforeEach(async () => {
	dummyData = {
		_id: otherTestId,
		email: 'dummy@mail.com',
		username: 'dummyName',
		password: 'HardP@ssw0rd213',
		sessions: [
			{
				_id: new mongoose.Types.ObjectId(),
				session: otherUserSession
			}
		]
	}
	configUpdate = {
		asset: 'eth',
		amount: 3000
	}
	await Transaction.deleteMany()
	await User.deleteMany()
	await Wallet.deleteMany()
	await Asset.deleteMany()

	await new Asset({ symbol: 'eth', name: 'ethereum' }).save()
	await new Asset({ symbol: 'ada', name: 'adada' }).save()
	await new Asset({ symbol: 'btc', name: 'bitcoin' }).save()

	let user = await new User(dummyData)
	await user.verified()
	otherToken = await user.makeAuthToken('localhost')

	user = await new User(testUser)
	await user.verified()
	token = await user.makeAuthToken('localhost')
	await new Wallet(testUserWallet).save()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe('Not authenticated cases', () => {
	test(`I should get a 401 not authenticate error message if I ping the route ${paths.wallets.default}`, async () => {
		await request(server).post(paths.wallets.default).send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route ${paths.wallets.default}`, async () => {
		await request(server).put(paths.wallets.default).send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route ${paths.wallets.default}`, async () => {
		await request(server).delete(paths.wallets.default).send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route POST ${paths.wallets['transaction-default']}:name`, async () => {
		await request(server).post(`${paths.wallets['transaction-default']}test`).send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route DELETE ${paths.wallets['transaction-default']}:name`, async () => {
		await request(server).delete(`${paths.wallets['transaction-default']}test`).send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route GET ${paths.wallets['transaction-default']}:name`, async () => {
		await request(server).get(`${paths.wallets['transaction-default']}test`).send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route ${paths.wallets.detailed}`, async () => {
		await request(server).get(paths.wallets.detailed).send().expect(401)
	})
})

describe(`Creation cases ${paths.wallets['transaction-default']}:name`, () => {
	const URL = paths.wallets['transaction-default'] + testUserWallet.asset

	test(`I should not be able to add content to my wallet if I don't have one`, async () => {
		await request(server)
			.post(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(404)
		const transactions = await Transaction.find({})
		expect(transactions.length).toBe(0)
	})

	test(`I should not be able to add content to my wallet if I don't provide the requirement`, async () => {
		await request(server)
			.post(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(400)
		const transactions = await Transaction.find({})
		const wallet = await Wallet.findOne({ owner: testId })
		expect(transactions.length).toBe(0)
		expect(wallet.history.length).toBe(0)
	})

	test(`I should be able to add content to my wallet if I provide the requirements and I have a wallet`, async () => {
		const body = {
			boughtAt: 40,
			paid: 20
		}
		await request(server)
			.post(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(body)
			.expect(201)
		const transactions = await Transaction.find({})
		const wallet = await Wallet.findOne({ owner: testId })
		expect(wallet.history.length).toBe(1)
		expect(transactions.length).toBe(1)
		expect(transactions[0].boughtAt).toBe(body.boughtAt)
		expect(transactions[0].paid).toBe(body.paid)
	})
})

describe(`Remove cases ${paths.wallets['transaction-default']}:name`, () => {
	const URL = paths.wallets['transaction-default'] + testUserWallet.asset

	test(`I should not be able to remove content from my wallet if I don't have one`, async () => {
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(404)
	})

	test(`I should not be able to remove content from my wallet if I don't provide the requirement`, async () => {
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(400)
	})

	test(`I should not be able to remove a wallet if I provide an invalid id`, async () => {
		const body = {
			boughtAt: 40,
			paid: 20
		}
		await request(server)
			.post(paths.wallets['transaction-default'] + testUserWallet.asset)
			.set({ Authorization: `Bearer ${token}` })
			.send(body)
			.expect(201)
		let transactions = await Transaction.find({})
		let wallet = await Wallet.findOne({ owner: testId })
		expect(wallet.history.length).toBe(1)
		expect(transactions.length).toBe(1)

		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send({ id: new mongoose.Types.ObjectId() })
			.expect(400)
		transactions = await Transaction.find({})
		wallet = await Wallet.findOne({ owner: testId })
		expect(wallet.history.length).toBe(1)
		expect(transactions.length).toBe(1)
	})

	test(`I should be able to remove content from my wallet if I provide the requirements and I have a wallet`, async () => {
		const body = {
			boughtAt: 40,
			paid: 20
		}
		await request(server)
			.post(paths.wallets['transaction-default'] + testUserWallet.asset)
			.set({ Authorization: `Bearer ${token}` })
			.send(body)
			.expect(201)
		let transactions = await Transaction.find({})
		let wallet = await Wallet.findOne({ owner: testId })
		expect(wallet.history.length).toBe(1)
		expect(transactions.length).toBe(1)

		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send({ id: transactions[0]._id })
			.expect(200)
		transactions = await Transaction.find({})
		wallet = await Wallet.findOne({ owner: testId })
		expect(wallet.history.length).toBe(0)
		expect(transactions.length).toBe(0)
	})
})

describe(`Get cases ${paths.wallets['transaction-default']}:name`, () => {
	const URL = paths.wallets['transaction-default'] + testUserWallet.asset

	test(`I should not be able to see the content of my wallet if I don't have one`, async () => {
		await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(404)
	})

	test(`I should be able to see the content of my wallet even if I don't have any informations in.`, async () => {
		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body).toBeDefined()
		expect(content.body.length).toBe(0)
	})

	test(`I should be able to see the content of my wallet and all of the informations in.`, async () => {
		const body = {
			boughtAt: 40,
			paid: 20
		}
		await request(server)
			.post(paths.wallets['transaction-default'] + testUserWallet.asset)
			.set({ Authorization: `Bearer ${token}` })
			.send(body)
			.expect(201)
		let transactions = await Transaction.find({})
		let wallet = await Wallet.findOne({ owner: testId })
		expect(wallet.history.length).toBe(1)
		expect(transactions.length).toBe(1)

		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body).toBeDefined()
		expect(content.body.length).toBe(1)
	})
})

describe(`Creation cases ${paths.wallets.default}`, () => {
	const URL = paths.wallets.default

	test(`I should not be able to create a duplicate wallet`, async () => {
		const walletData = {
			asset: 'eth',
			amount: 11
		}
		let user = await User.findById(testId)
		await user.populate({
			path: 'wallet'
		})

		let walletAmountInDB = (await Wallet.find({})).length
		let currentWallet = user.wallet.length
		expect(currentWallet).toBe(1)
		expect(walletAmountInDB).toBe(1)

		await request(server)
			.post(URL)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(walletData)
			.expect(409)

		// Checking if it didnt add the new wallet
		user = await User.findById(testId)
		await user.populate({
			path: 'wallet'
		})
		currentWallet = user.wallet.length
		expect(currentWallet).toBe(1)
		walletAmountInDB = (await Wallet.find({})).length
		expect(walletAmountInDB).toBe(1)
	})

	test(`I should not be able to set a negative amount for a wallet`, async () => {
		const walletData = {
			asset: 'btc',
			amount: -1
		}
		let user = await User.findById(testId)
		await user.populate({
			path: 'wallet'
		})

		let walletAmountInDB = (await Wallet.find({})).length
		let currentWallet = user.wallet.length
		expect(currentWallet).toBe(1)
		expect(walletAmountInDB).toBe(1)

		await request(server)
			.post(URL)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(walletData)
			.expect(400)

		// Checking if it didnt add the new wallet
		user = await User.findById(testId)
		await user.populate({
			path: 'wallet'
		})
		walletAmountInDB = (await Wallet.find({})).length
		currentWallet = user.wallet.length
		expect(currentWallet).toBe(1)
		expect(walletAmountInDB).toBe(1)
	})

	test(`I should be able to add a wallet that does not exist with a positive amount`, async () => {
		const walletData = {
			asset: 'btc',
			amount: 40
		}
		let user = await User.findById(testId)
		await user.populate({
			path: 'wallet'
		})

		let walletAmountInDB = (await Wallet.find({})).length
		let currentWallet = user.wallet.length
		expect(currentWallet).toBe(1)
		expect(walletAmountInDB).toBe(1)

		await request(server)
			.post(URL)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(walletData)
			.expect(201)

		// Checking if it didnt add the new wallet
		user = await User.findById(testId)
		await user.populate({
			path: 'wallet'
		})
		walletAmountInDB = (await Wallet.find({})).length
		currentWallet = user.wallet.length
		expect(walletAmountInDB).toBe(2)
		expect(currentWallet).toBe(2)
	})
})

describe(`Modification cases ${paths.wallets.default}`, () => {
	const URL = paths.wallets.default

	test(`I should not be able to provide an empty body for modification`, async () => {
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(400)
	})

	test(`I should not be able to provide only the asset name in the body for modification`, async () => {
		delete configUpdate.amount
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(configUpdate)
			.expect(400)
	})

	test(`I should not be able to provide only the amount in the body for modification`, async () => {
		delete configUpdate.asset
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(configUpdate)
			.expect(400)
	})

	test(`I should not be able to provide random informations other than the amount and the asset name in the body for modification`, async () => {
		configUpdate.random = true
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(configUpdate)
			.expect(400)
	})

	test(`I should not be able to modify a wallet by providing the right informations if I don't have any wallet`, async () => {
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send(configUpdate)
			.expect(404)
	})

	test(`I should be able to modify the wallet with the proper modification's field.`, async () => {
		let wallet = await Wallet.findById(testWalletId)
		const currentAmount = wallet.amount
		const currentAsset = wallet.asset
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(configUpdate)
			.expect(200)

		wallet = await Wallet.findById(testWalletId)
		expect(currentAmount).not.toBe(wallet.amount)
		expect(wallet.amount).toBe(configUpdate.amount)
		expect(currentAsset).toBe(wallet.asset)
	})
})

describe(`Delete cases ${paths.wallets.default}`, () => {
	const URL = paths.wallets.default

	test(`I should not be able to provide an empty asset`, async () => {
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(400)
	})

	test(`I should not be able to delete a wallet if I don't have one`, async () => {
		let wallets = await Wallet.find({})
		let amount = wallets.length
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send({
				asset: 'eth'
			})
			.expect(404)

		// Quick verification
		wallets = await Wallet.find({})
		expect(amount).toBe(wallets.length)
	})

	test(`I should be able to delete a wallet`, async () => {
		let wallets = await Wallet.find({})
		let amount = wallets.length
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send({
				asset: 'eth'
			})
			.expect(204)

		// Quick verification
		wallets = await Wallet.find({})
		expect(amount).not.toBe(wallets.length)
		expect(wallets.length).toBe(0)
	})
})

describe(`Detailed cases ${paths.wallets.detailed}`, () => {
	const URL = paths.wallets.detailed

	test(`I should not be able to see detailed informations about my wallets if I don't have one`, async () => {
		await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(404)
	})

	test(`I should get a detailed response if I have one wallet`, async () => {
		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body.assets.length).toBe(1)
		expect(content.body.assets[0]).toBeDefined()
	})

	test(`I should get a detailed response for both wallets if I have two wallets`, async () => {
		const newAsset = 'ada'

		await request(server)
			.post(paths.wallets.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				asset: newAsset,
				amount: 0
			})
			.expect(201)

		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body.assets.length).toBe(2)
		expect(content.body.assets[0]).toBeDefined()
		expect(content.body.assets[1].name).toBe(newAsset)
	})

	const BODY = {
		boughtAt: 1000,
		paid: 500
	}

	test(`The coverage should be 100% if I add details to an asset`, async () => {
		await request(server)
			.post(`${paths.wallets['transaction-default']}${testUserWallet.asset}`)
			.set({ Authorization: `Bearer ${token}` })
			.send(BODY)
			.expect(201)
		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body.assets.length).toBe(1)
		expect(content.body.assets[0]).toBeDefined()
		expect(content.body.coverage).toBe(100)
	})

	test(`The totalSpent should be equal to the amount spent if I add details to an asset and I have only one asset`, async () => {
		await request(server)
			.post(`${paths.wallets['transaction-default']}${testUserWallet.asset}`)
			.set({ Authorization: `Bearer ${token}` })
			.send(BODY)
			.expect(201)
		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body.assets.length).toBe(1)
		expect(content.body.assets[0]).toBeDefined()
		expect(content.body.totalSpent).toBe(BODY.paid)
	})

	test(`I should be able to see small informations about the asset if I add details to an asset and I have only one asset`, async () => {
		await request(server)
			.post(`${paths.wallets['transaction-default']}${testUserWallet.asset}`)
			.set({ Authorization: `Bearer ${token}` })
			.send(BODY)
			.expect(201)
		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body.assets.length).toBe(1)
		expect(content.body.assets[0].name).toBeDefined()

		const walletHistoryDetailed = content.body.assets[0]
		expect(walletHistoryDetailed.totalSpent).toBe(BODY.paid)
		expect(walletHistoryDetailed.averageSpent).toBe(BODY.paid)
		expect(walletHistoryDetailed.amount).toBe(0.5) // paid / boughtAt
		expect(walletHistoryDetailed.transactions).toBe(1)
		expect(walletHistoryDetailed.percentInPortfolio).toBe(100)
	})
})
