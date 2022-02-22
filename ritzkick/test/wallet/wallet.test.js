const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../application/app')
const User = require('../../db/model/user')
const Wallet = require('../../db/model/wallet')

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
	await User.deleteMany()
    await Wallet.deleteMany()
	let user = await new User(dummyData)
	await user.save()
    otherToken = await user.makeAuthToken()

    user = await new User(testUser)
    await user.save()
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

        await request(server).post(URL).set({
            Authorization: `Bearer ${token}`
        }).send(walletData).expect(400)

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

        await request(server).post(URL).set({
            Authorization: `Bearer ${token}`
        }).send(walletData).expect(400)

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

        await request(server).post(URL).set({
            Authorization: `Bearer ${token}`
        }).send(walletData).expect(201)

        console.log(user)

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
        await request(server).put(URL).set({ Authorization: `Bearer ${token}` }).send().expect(400)
    })

    test(`'BAD REQUEST' cannot provide only the asset name in the body for modification`, async () => {
        delete configUpdate.amount
        await request(server).put(URL).set({ Authorization: `Bearer ${token}` }).send(configUpdate).expect(400)
    })

    test(`'BAD REQUEST' cannot provide only the amount in the body for modification`, async () => {
        delete configUpdate.asset
        await request(server).put(URL).set({ Authorization: `Bearer ${token}` }).send(configUpdate).expect(400)
    })

    test(`'BAD REQUEST' cannot provide random informations other than the amount and the asset name in the body for modification`, async () => {
        configUpdate.random = true
        await request(server).put(URL).set({ Authorization: `Bearer ${token}` }).send(configUpdate).expect(400)
    })

    test(`'BAD REQUEST' by providing the right informations, if the user does not have any wallet, it should not be able to modify it`, async () => {
        await request(server).put(URL).set({ Authorization: `Bearer ${otherToken}` }).send(configUpdate).expect(400)
    })

    test(`'MODIFY REQUEST' you can modify the wallet with the proper modification's field.`, async () => {
        let wallet = await Wallet.findById(testWalletId)
        const currentAmount = wallet.amount
        const currentAsset = wallet.asset
        await request(server).put(URL).set({ Authorization: `Bearer ${token}` }).send(configUpdate).expect(200)

        wallet = await Wallet.findById(testWalletId)
        expect(currentAmount).not.toBe(wallet.amount)
        expect(wallet.amount).toBe(configUpdate.amount)
        expect(currentAsset).toBe(wallet.asset)
    })

})

describe(`Delete cases /api/wallets/delete`, () => {
    const URL = '/api/wallets/delete'

    test(`'BAD REQUEST' you cannot provide an empty asset`, async () => {
        await request(server).delete(URL).set({ Authorization: `Bearer ${token}` }).send().expect(400)
    })

    test(`'BAD REQUEST' you can't delete a wallet if you don't have one`, async () => {
        let wallets = await Wallet.find({})
        let amount = wallets.length
        await request(server).delete(URL).set({ Authorization: `Bearer ${otherToken}` }).send({
            asset: 'eth'
        }).expect(400)

        // Quick verification
        wallets = await Wallet.find({})
        expect(amount).toBe(wallets.length)
    })

    test(`'DELETE REQUEST' you can't delete a wallet if you don't have one`, async () => {
        let wallets = await Wallet.find({})
        let amount = wallets.length
        await request(server).delete(URL).set({ Authorization: `Bearer ${token}` }).send({
            asset: 'eth'
        }).expect(204)

        // Quick verification
        wallets = await Wallet.find({})
        expect(amount).not.toBe(wallets.length)
        expect(wallets.length).toBe(0)
    })
})