const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const server = require('../../app/app')
const User = require('../../db/model/user')
const Watchlist = require('../../db/model/watchlist')

const es = require('../../app/email/email-service')

const paths = require('../../api/routes.json')

const testId = new mongoose.Types.ObjectId()
const testAlertId = new mongoose.Types.ObjectId()
const someoneAlertId = new mongoose.Types.ObjectId()

const fs = require('fs')
const privateKey = fs.readFileSync(`${__dirname}/../../config/keys/${process.env.ES256_KEY}-priv-key.pem`)

const jwtOptions = {
	algorithm: 'ES256',
	subject: 'Lumoonade Auth',
	issuer: 'localhost',
	audience: 'localhost'
}

const token = jwt.sign({ _id: testId }, privateKey, jwtOptions)

let dummyData

const testUser = {
	_id: testId,
	email: 'test@mail.com',
	username: 'test_account',
	password: 'HardP@ssw0rd213',
	sessions: [
		{
			session: token
		}
	]
}

const testAlert = {
	_id: testAlertId,
	owner: someoneAlertId,
	slug: 'btc',
	parameter: 'lte',
	target: 2000
}

beforeEach(async () => {
	dummyData = {
		slug: 'eth',
		parameter: 'gte',
		target: 40000
	}
	await User.deleteMany()
	await Watchlist.deleteMany()
	await new User(testUser).verified()
	await new Watchlist(testAlert).save()
})

afterEach(() => {
	es.kill()
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe(`Create tests cases ${paths.alerts.default}`, () => {
	test(`I should not be able to add a new alert if I'm not authenticated`, async () => {
		await request(server).post(paths.alerts.default).send().expect(401)
	})

	test(`I should be able to create a new alert when I'm authenticated`, async () => {
		const response = await request(server)
			.post(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(dummyData)
			.expect(201)

		const user = await User.findOne({ _id: testId })
		const alert = await Watchlist.findOne({ _id: response.body._id })

		expect(alert._id).toStrictEqual(user.watchlist_list[0].watch)
	})

	test(`I should be able to create multiple alerts when I'm authenticated`, async () => {
		const ALERT_NUMBER = 2

		for (let i = 0; i < ALERT_NUMBER; i++) {
			await request(server)
				.post(paths.alerts.default)
				.set({
					Authorization: `Bearer ${token}`
				})
				.send(dummyData)
				.expect(201)
		}

		const user = await User.findOne({ _id: testId })
		const alerts = await Watchlist.find({ owner: user._id })

		expect(alerts.length).toBe(ALERT_NUMBER)
		alerts.forEach((alert, index) => {
			expect(alert._id).toStrictEqual(user.watchlist_list[index].watch)
		})
	})
})

describe(`Update tests cases ${paths.alerts.default}`, () => {
	test(`I should not be able to modify an alert if I'm not authenticated`, async () => {
		await request(server).put(paths.alerts.default).send().expect(401)
	})

	test(`I should not be able to modify someone else's alert`, async () => {
		await request(server)
			.put(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: someoneAlertId
			})
			.expect(404)
	})

	test(`I should be able to modify my own alert (target)`, async () => {
		// Adding a dummy alert
		const response = await request(server)
			.post(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(dummyData)
			.expect(201)

		const newAlert = response.body
		let target = newAlert.target + 20000

		await request(server)
			.put(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: newAlert._id,
				target
			})
			.expect(200)

		const alert = await Watchlist.findOne({ _id: newAlert._id })
		expect(alert.target).not.toBe(newAlert.target)
		expect(alert.target).toBe(target)
	})

	test(`I should be able to modify my alert with (VALID parameter)`, async () => {
		// Adding a dummy alert
		dummyData.parameter = 'gte'
		const response = await request(server)
			.post(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(dummyData)
			.expect(201)

		const newAlert = response.body
		let parameter = 'lte'

		await request(server)
			.put(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: newAlert._id,
				parameter
			})
			.expect(200)

		const alert = await Watchlist.findOne({ _id: newAlert._id })
		expect(alert.parameter).not.toBe(newAlert.parameter)
		expect(alert.parameter).toBe(parameter)
	})

	test(`I should not be able to modify my alert with (INVALID parameter)`, async () => {
		// Adding a dummy alert
		const response = await request(server)
			.post(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(dummyData)
			.expect(201)

		const newAlert = response.body
		let parameter = 'invalid'

		await request(server)
			.put(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: newAlert._id,
				parameter
			})
			.expect(400)

		// We want to see if nothing changed
		const alert = await Watchlist.findOne({ _id: newAlert._id })
		expect(alert.parameter).toBe(newAlert.parameter)
		expect(alert.parameter).not.toBe(parameter)
	})

	test(`I should not be able to modify my alert with non existing parameters`, async () => {
		// Adding a dummy alert
		const response = await request(server)
			.post(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(dummyData)
			.expect(201)

		const newAlert = response.body
		let dummyFeeder = {
			test: true,
			fail: true
		}

		await request(server)
			.put(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: newAlert._id,
				...dummyFeeder
			})
			.expect(400)

		// We want to see if nothing changed
		const alert = await Watchlist.findOne({ _id: newAlert._id })
		expect(alert.owner.toString()).toStrictEqual(newAlert.owner)
		expect(alert.slug).toStrictEqual(newAlert.slug)
		expect(alert.target).toStrictEqual(newAlert.target)
		expect(alert.parameter).toStrictEqual(newAlert.parameter)
	})

	test(`I should not be able to modify my alert with a negative target`, async () => {
		// Adding a dummy alert
		const response = await request(server)
			.post(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(dummyData)
			.expect(201)

		const newAlert = response.body
		let target = -1

		await request(server)
			.put(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: newAlert._id,
				target
			})
			.expect(400)

		// We want to see if nothing changed
		const alert = await Watchlist.findOne({ _id: newAlert._id })
		expect(alert.target).toStrictEqual(newAlert.target)
	})
})

describe(`Delete tests cases ${paths.alerts.default}`, () => {
	test(`I should not be able to delete an alert if I'm not authenticated`, async () => {
		await request(server).delete(paths.alerts.default).send().expect(401)
	})

	test(`I should not be able to delete someone else's alert`, async () => {
		await request(server)
			.delete(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: someoneAlertId
			})
			.expect(404) // Not Found

		// We want to see if nothing changed
		const alert = await Watchlist.findOne({ owner: someoneAlertId })
		expect(alert).toBeDefined()
		expect(alert).not.toBeNull()
	})

	test(`I should be able to delete my alert`, async () => {
		// Adding a dummy alert
		const response = await request(server)
			.post(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send(dummyData)
			.expect(201)

		let alert = await Watchlist.findOne({ _id: response.body._id })
		let user = await User.findOne({ _id: testId })
		expect(user.watchlist_list.length).toBe(1)
		expect(alert).toBeDefined()

		await request(server)
			.delete(paths.alerts.default)
			.set({
				Authorization: `Bearer ${token}`
			})
			.send({
				id: response.body._id
			})
			.expect(200)

		user = await User.findOne({ _id: testId })
		alert = await Watchlist.findOne({ _id: response.body._id })
		expect(user.watchlist_list.length).toBe(0)
		expect(alert).toBeNull()
	})
})
