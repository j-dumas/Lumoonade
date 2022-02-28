const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../app/app')
const User = require('../../db/model/user')
const Wallet = require('../../db/model/wallet')
const Transaction = require('../../db/model/transaction')

const validSecret = process.env.JWTSECRET
const testId = new mongoose.Types.ObjectId()
const otherTestId = new mongoose.Types.ObjectId()
const testWalletId = new mongoose.Types.ObjectId()
const testUserSession = jwt.sign({ _id: new mongoose.Types.ObjectId() }, validSecret)
const otherUserSession = jwt.sign({ _id: new mongoose.Types.ObjectId() }, validSecret)

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
	let user = await new User(dummyData)
	await user.verified()
	otherToken = await user.makeAuthToken()

	user = await new User(testUser)
	await user.verified()
	token = await user.makeAuthToken()
	await new Wallet(testUserWallet).save()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe('Not authenticated cases', () => {
	test('I should get a 401 not authenticate error message if I ping the route /api/wallets', async () => {
		await request(server).post('/api/wallets').send().expect(401)
	})

	test('I should get a 401 not authenticate error message if I ping the route /api/wallets/update', async () => {
		await request(server).put('/api/wallets/update').send().expect(401)
	})

	test('I should get a 401 not authenticate error message if I ping the route /api/wallets/delete', async () => {
		await request(server).delete('/api/wallets/delete').send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route /api/wallet/:name/add`, async () => {
		await request(server).post('/api/wallet/test/add').send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route /api/wallet/:name/remove`, async () => {
		await request(server).delete('/api/wallet/test/remove').send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route /api/wallet/:name/content`, async () => {
		await request(server).get('/api/wallet/test/content').send().expect(401)
	})

	test(`I should get a 401 not authenticate error message if I ping the route /api/wallet/:name/content`, async () => {
		await request(server).get('/api/wallets/detailed').send().expect(401)
	})
})

describe('Creation cases (/api/wallet/:name/add)', () => {
	const URL = '/api/wallet/' + testUserWallet.asset + '/add'

	test(`'BAD REQUEST' you cannot add content to your wallet if you don't have one`, async () => {
		await request(server)
			.post(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(400)
		const transactions = await Transaction.find({})
		expect(transactions.length).toBe(0)
	})

	test(`'BAD REQUEST' you can't add content to your wallet if you don't provide the requirement`, async () => {
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

	test(`'CREATE REQUEST' you can add content to your wallet if you provide the requirements and you have a wallet`, async () => {
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

describe('Remove cases (/api/wallet/:name/remove)', () => {
	const URL = '/api/wallet/' + testUserWallet.asset + '/remove'

	test(`'BAD REQUEST' you cannot remove content from your wallet if you don't have one`, async () => {
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(400)
	})

	test(`'BAD REQUEST' you can't remove content from your wallet if you don't provide the requirement`, async () => {
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(400)
	})

	test(`'BAD REQUEST' you can't remove a wallet if you provide the an invalid id`, async () => {
		const body = {
			boughtAt: 40,
			paid: 20
		}
		await request(server)
			.post('/api/wallet/' + testUserWallet.asset + '/add')
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

	test(`'REMOVE REQUEST' you can remove content from your wallet if you provide the requirements and you have a wallet`, async () => {
		const body = {
			boughtAt: 40,
			paid: 20
		}
		await request(server)
			.post('/api/wallet/' + testUserWallet.asset + '/add')
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

describe('Get cases (/api/wallet/:name/content)', () => {
	const URL = '/api/wallet/' + testUserWallet.asset + '/content'

	test(`'BAD REQUEST' you can't display the content of your wallet if you don't have one`, async () => {
		await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(400)
	})

	test(`'SUCCESS REQUEST' you can see the content of your wallet even if you don't have any informations in.`, async () => {
		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body).toBeDefined()
		expect(content.body.length).toBe(0)
	})

	test(`'SUCCESS REQUEST' you can see the content of your wallet and all of the informations in.`, async () => {
		const body = {
			boughtAt: 40,
			paid: 20
		}
		await request(server)
			.post('/api/wallet/' + testUserWallet.asset + '/add')
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

describe('Creation cases (/api/wallets)', () => {
	const URL = '/api/wallets'

	test(`'BAD REQUEST' you cannot create a duplicate wallet`, async () => {
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
			.expect(400)

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

	test(`'BAD REQUEST' you cannot set a negative amount for a wallet`, async () => {
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

	test(`'CREATE REQUEST' you can add a wallet that does not exist with a positive amount`, async () => {
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

describe('Modification cases /api/wallets/update', () => {
	const URL = '/api/wallets/update'

	test(`'BAD REQUEST' cannot provide an empty body for modification`, async () => {
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(400)
	})

	test(`'BAD REQUEST' cannot provide only the asset name in the body for modification`, async () => {
		delete configUpdate.amount
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(configUpdate)
			.expect(400)
	})

	test(`'BAD REQUEST' cannot provide only the amount in the body for modification`, async () => {
		delete configUpdate.asset
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(configUpdate)
			.expect(400)
	})

	test(`'BAD REQUEST' cannot provide random informations other than the amount and the asset name in the body for modification`, async () => {
		configUpdate.random = true
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send(configUpdate)
			.expect(400)
	})

	test(`'BAD REQUEST' by providing the right informations, if the user does not have any wallet, it should not be able to modify it`, async () => {
		await request(server)
			.put(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send(configUpdate)
			.expect(400)
	})

	test(`'MODIFY REQUEST' you can modify the wallet with the proper modification's field.`, async () => {
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

describe(`Delete cases /api/wallets/delete`, () => {
	const URL = '/api/wallets/delete'

	test(`'BAD REQUEST' you cannot provide an empty asset`, async () => {
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(400)
	})

	test(`'BAD REQUEST' you can't delete a wallet if you don't have one`, async () => {
		let wallets = await Wallet.find({})
		let amount = wallets.length
		await request(server)
			.delete(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send({
				asset: 'eth'
			})
			.expect(400)

		// Quick verification
		wallets = await Wallet.find({})
		expect(amount).toBe(wallets.length)
	})

	test(`'DELETE REQUEST' you can't delete a wallet if you don't have one`, async () => {
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

describe(`Detailed cases (/api/wallets/detailed)`, () => {
	const URL = '/api/wallets/detailed'

	test(`'BAD REQUEST' you can't see detailed informations about your wallets if you don't have one`, async () => {
		await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${otherToken}` })
			.send()
			.expect(400)
	})

	test(`'SUCCESS REQUEST' if you have one wallet, you should get a detailed response.`, async () => {
		const content = await request(server)
			.get(URL)
			.set({ Authorization: `Bearer ${token}` })
			.send()
			.expect(200)
		expect(content.body.assets.length).toBe(1)
		expect(content.body.assets[0]).toBeDefined()
	})

	test(`'SUCCESS REQUEST' if you have two wallets, you should get a detailed response for both.`, async () => {
		const newAsset = 'ada'

		await request(server)
			.post('/api/wallets')
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				asset: newAsset,
				amount: 0
			})
			.expect(201)

		// const body = {
		//     boughtAt: 1000,
		//     paid: 500
		// }
		// await request(server).post(`/api/wallet/${newAsset}/add`).set({ Authorization: `Bearer ${token}` }).send(body).expect(201)

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

	test(`'SUCCESS REQUEST' if you add details to an asset, the coverage should be 100%`, async () => {
		await request(server)
			.post(`/api/wallet/${testUserWallet.asset}/add`)
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

	test(`'SUCCESS REQUEST' if you add details to an asset, and you have only one asset, the totalSpent should be equal to the amount spent`, async () => {
		await request(server)
			.post(`/api/wallet/${testUserWallet.asset}/add`)
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

	test(`'SUCCESS REQUEST' if you add details to an asset, and you have only one asset, you should be able to see small informations about the asset`, async () => {
		await request(server)
			.post(`/api/wallet/${testUserWallet.asset}/add`)
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
		expect(walletHistoryDetailed.holding).toBe(0.5) // paid / boughtAt
		expect(walletHistoryDetailed.transactions).toBe(1)
		expect(walletHistoryDetailed.percentInPortfolio).toBe(100)
	})
})
