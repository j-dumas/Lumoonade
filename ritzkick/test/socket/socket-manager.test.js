const http = require('http')
const sm = require('../../app/socket/socket-manager')
const rm = require('../../app/socket/room-manager')
const Client = require('socket.io-client')

describe('Tests for Socket-Manager', () => {
	let client, server, port
	let defaultQuery = ['btc-cad']
	let defaultRoom = 'general'

	beforeAll((done) => {
		server = http.createServer()
		sm.initialize(server)
		server.listen(() => {
			done()
		})
	})

	beforeEach((done) => {
		port = server.address().port
		client = new Client(`http://localhost:${port}`, {
			auth: {
				rooms: [defaultRoom],
				query: defaultQuery,
				graph: false
			}
		})
		client.on('ready', () => {
			// This is called if the socket passes the test
			done()
		})
	})

	afterEach((done) => {
		client.close()
		done()
	})

	afterAll((done) => {
		sm.close()
		client.close()
		done()
	})

	test('Switching to a single channel, I must be only in that room', (done) => {
		let channel = 'graph-1d-1m'
		// Waiting for a 'executed' called, we don't care about the content.
		client.on('executed', (_) => {
			let rooms = rm.getRoomsOfSocket(client.id)
			expect(rooms.length).toBe(1)
			expect(rooms[0].name).toBe(channel)
			done()
		})
		client.emit('switch', client.id, [channel], true)
	})

	test('Switching to two channels, I must be in these rooms', (done) => {
		let channels = ['graph-1d-1m', 'graph-5y-1mo']
		// Waiting for a 'executed' called, we don't care about the content.
		client.on('executed', (_) => {
			let rooms = rm.getRoomsOfSocket(client.id)
			expect(rooms.length).toBe(2)
			rooms.forEach((room) => {
				let exists = channels.find((channel) => channel === room.name)
				expect(exists).toBeTruthy()
			})
			done()
		})
		client.emit('switch', client.id, channels, true)
	})

	test(`Switching to a new room causes to stop the current room's service and run the new one`, (done) => {
		let newChannel = ['graph-1d-1m']
		let channelServiceState = rm.getRoom(defaultRoom).getService().isRunning()
		expect(channelServiceState).toBeTruthy()
		// Waiting for a 'executed' called, we don't care about the content.
		client.on('executed', (_) => {
			channelServiceState = rm.getRoom(defaultRoom).getService().isRunning()
			expect(channelServiceState).toBeFalsy()
			let newChannelService = rm.getRoomsOfSocket(client.id)[0].getService()
			expect(newChannelService.isRunning()).toBeTruthy()
			done()
		})
		client.emit('switch', client.id, newChannel, true)
	})

	test(`Updating client's query to the same thing, It should not change`, (done) => {
		// Waiting for a 'executed' called, we don't care about the content.
		client.on('executed', (_) => {
			let rooms = rm.getRoomsOfSocket(client.id)
			expect(rooms.length).toBe(1)
			expect(rooms[0].clients[0].query).toStrictEqual(defaultQuery)
			done()
		})
		client.emit('update', client.id, client.auth.query)
	})

	test(`Updating client's query to new queries, It should change to the new ones`, (done) => {
		let newQuery = ['eth-cad', 'eth-usd']
		// Waiting for a 'executed' called, we don't care about the content.
		client.on('executed', (_) => {
			let rooms = rm.getRoomsOfSocket(client.id)
			expect(rooms.length).toBe(1)
			expect(rooms[0].clients[0].query).toStrictEqual(newQuery)
			done()
		})
		client.emit('update', client.id, newQuery)
	})

	test(`Updating client's query to new queries should also change the service query`, (done) => {
		let newQuery = ['eth-cad', 'eth-usd']
		// Waiting for a 'executed' called, we don't care about the content.
		client.on('executed', (_) => {
			let rooms = rm.getRoomsOfSocket(client.id)
			expect(rooms.length).toBe(1)
			expect(rooms[0].getService().query).toStrictEqual(newQuery)
			expect(rooms[0].getService().query.length).toBe(newQuery.length)
			done()
		})
		client.emit('update', client.id, newQuery)
	})

	test(`When multiple client are connected to the room and someone change the query, it should not override the current query of the service`, (done) => {
		let newQuery = ['eth-cad', 'eth-usd']
		let newConnection = new Client(`http://localhost:${port}`, {
			auth: {
				rooms: [defaultRoom],
				query: defaultQuery,
				graph: false
			}
		})

		newConnection.on('ready', () => {
			// Waiting for a 'executed' called, we don't care about the content.
			client.on('executed', (_) => {
				let rooms = rm.getRoomsOfSocket(client.id)
				expect(rooms.length).toBe(1)
				expect(rooms[0].getService().query.length).toBe(newQuery.length + 1) // the new connection query + our query
				newQuery.push(...defaultQuery)
				let allThere = rooms[0].getService().query.every((e) => newQuery.find((a) => a === e))
				expect(allThere).toBeTruthy()
				newConnection.close()
				done()
			})
			client.emit('update', client.id, newQuery)
		})

		newConnection.on('reject', (_) => {
			done.fail()
		})
	})

	test(`When someone join with a query that already exists, the service query should not contains both version (upper cases)`, (done) => {
		let newQuery = ['eth-cad', 'eth-usd']
		let newConnection = new Client(`http://localhost:${port}`, {
			auth: {
				rooms: [defaultRoom],
				query: ['ETH-CAD'],
				graph: false
			}
		})

		newConnection.on('ready', () => {
			// Waiting for a 'executed' called, we don't care about the content.
			client.on('executed', (_) => {
				let room = rm.getRoom(defaultRoom)
				let service = room.getService()
				expect(service.query.length).toBe(2)
				expect(service.query).toStrictEqual(newQuery)
				newConnection.close()
				done()
			})
			client.emit('update', client.id, newQuery)
		})

		newConnection.on('reject', (_) => {
			done.fail()
		})
	})

	test(`When multiple client are connected to the room and someone disconnect, it should remove the query in the service`, (done) => {
		let newConnection = new Client(`http://localhost:${port}`, {
			auth: {
				rooms: [defaultRoom],
				query: [...defaultQuery, 'ada-cad'],
				graph: false
			}
		})

		newConnection.on('ready', () => {
			let newConnection2 = new Client(`http://localhost:${port}`, {
				auth: {
					rooms: [defaultRoom],
					query: [...defaultQuery, 'eth-cad', 'eth-eur'],
					graph: false
				}
			})

			newConnection2.on('reject', (_) => {
				done.fail()
			})

			newConnection2.on('ready', () => {
				// Waiting for a 'executed' called, we don't care about the content.
				client.on('executed', (_) => {
					let room = rm.getRoomsOfSocket(client.id)[0]
					let service = room.getService()

					// Adding setTimeout calls to let the socket the time to properly disconnect
					setTimeout(() => {
						newConnection2.close()
						// This should remove ['eth-cad', 'eth-eur'] because this is the only one calling these
					}, 0)

					setTimeout(() => {
						expect(service.query.length).toBe(2)
						const expectedList = [...defaultQuery, 'ada-cad']
						expect(service.query).toStrictEqual(expectedList)
						newConnection.close()
					}, 50)

					setTimeout(() => {
						expect(service.query.length).toBe(1)
						expect(service.query).toStrictEqual(defaultQuery)
						done()
					}, 100)
				})
				client.emit('update', client.id, defaultQuery)
			})
		})

		newConnection.on('reject', (_) => {
			done.fail()
		})
	})
})
