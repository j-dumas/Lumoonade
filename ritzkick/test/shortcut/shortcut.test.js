const request = require('supertest')
const mongoose = require('mongoose')
const server = require('../../app/app')
const Shortcut = require('../../db/model/shortcut')

const paths = require('../../api/routes.json')

const domainURL = `https://${process.env.URL}:${process.env.PORT}`

let config

beforeEach(async () => {
	await Shortcut.deleteMany()
	config = {
		url: '/asset/btc',
		destroyable: false
	}
})

afterAll((done) => {
	mongoose.connection.close()
	done()
})

describe(`Testing all redirections "GET" ${paths.shortcut.redirect}:id`, () => {
	const URL = paths.shortcut.redirect

	test(`I should be redirected to home page if the shortcut id doesn't exist`, async () => {
		const randomID = new mongoose.Types.ObjectId()
		await request(server)
			.get(URL + randomID)
			.send()
			.expect(302)
			.expect('Location', '/')
	})

	test(`I should be redirected to the page if the shortcut id does exist`, async () => {
		let response = await request(server).post(paths.shortcut.default).send(config).expect(201)
		await request(server)
			.get(response.body.url.split(domainURL)[1])
			.send()
			.expect(302)
			.expect('Location', config.url)
	})

	test(`I should be redirected to the page if the shortcut id does exist and deletes it if we set it to destroyable`, async () => {
		config.destroyable = true
		let response = await request(server).post(paths.shortcut.default).send(config).expect(201)
		let shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(1)
		await request(server)
			.get(response.body.url.split(domainURL)[1])
			.send()
			.expect(302)
			.expect('Location', config.url)
		shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(0)
	})

	test(`I should be redirected to the page if the shortcut id does exist and deletes it if we set it to destroyable and we use it 'maxUse' times`, async () => {
		config.destroyable = true
		config.maxUse = 2
		let response = await request(server).post(paths.shortcut.default).send(config).expect(201)
		let shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(1)
		await request(server)
			.get(response.body.url.split(domainURL)[1])
			.send()
			.expect(302)
			.expect('Location', config.url)
		shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(1)
		await request(server)
			.get(response.body.url.split(domainURL)[1])
			.send()
			.expect(302)
			.expect('Location', config.url)
		shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(0)
		await request(server).get(response.body.url.split(domainURL)[1]).send().expect(302).expect('Location', '/')
	})
})

describe(`Testing creation cases 'POST' ${paths.shortcut.default}`, () => {
	const URL = paths.shortcut.default

	test(`It should throw an error if I provide nothing in the body`, async () => {
		await request(server).post(URL).send().expect(400)
	})

	test(`It should throw an error if I provide a number of visits in the body`, async () => {
		config.visits = 1000
		await request(server).post(URL).send(config).expect(409)
	})

	test(`It should create a shortcut url if I provide all params required`, async () => {
		let shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(0)
		await request(server).post(URL).send(config).expect(201)
		shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(1)
		expect(shortcuts[0].url).toBe(config.url)
		expect(shortcuts[0].destroyable).toBe(config.destroyable)
		expect(shortcuts[0].maxUse).toBe(0)
		expect(shortcuts[0].visits).toBe(0)
	})

	test(`It should return a shortcut url if the shortcut with the same url already exists`, async () => {
		let shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(0)
		let response = await request(server).post(URL).send(config).expect(201)
		let responseURL = response.body.url
		shortcuts = await Shortcut.find({})
		expect(responseURL).toBeDefined()
		expect(shortcuts.length).toBe(1)
		expect(shortcuts[0].url).toBe(config.url)
		expect(shortcuts[0].destroyable).toBe(config.destroyable)
		expect(shortcuts[0].maxUse).toBe(0)
		expect(shortcuts[0].visits).toBe(0)

		response = await request(server).post(URL).send(config).expect(200)
		shortcuts = await Shortcut.find({})
		expect(shortcuts.length).toBe(1)
		expect(response.body.url).toBe(responseURL)
	})
})
