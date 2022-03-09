const connectionManager = require('../../app/socket/connection-manager')

beforeEach(() => {
	connectionManager.clean()
})

describe(`All tests related to the connection-manager`, () => {
	let dummySocket = {
		id: 1
	}

	test('I should not have any connections on creation', () => {
		expect(connectionManager.getConnections().length).toBe(0)
	})

	test('I should be able to add a socket if it does not exist in the connections', () => {
		expect(connectionManager.getConnections().length).toBe(0)

		connectionManager.registerConnection(dummySocket)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
	})

	test('I should not be able to add a socket if it already exists in the connections', () => {
		expect(connectionManager.getConnections().length).toBe(0)

		connectionManager.registerConnection(dummySocket)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)

		connectionManager.registerConnection(dummySocket)
		expect(connectionManager.getConnections().length).toBe(1)
	})

	test('I should be able to set a channel to listen to', () => {
		expect(connectionManager.getConnections().length).toBe(0)

		connectionManager.registerConnection(dummySocket)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
		expect(connectionManager.getConnections()[0].channels.length).toBe(0)

		let channel = 'general'
		connectionManager.registerListeningChannel(dummySocket, channel)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].channels.length).toBe(1)
		expect(connectionManager.getConnections()[0].channels[0]).toBe(channel)
	})

	test('I should be able to remove a channel from a connection', () => {
		expect(connectionManager.getConnections().length).toBe(0)

		connectionManager.registerConnection(dummySocket)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
		expect(connectionManager.getConnections()[0].channels.length).toBe(0)

		let channel = 'general'
		connectionManager.registerListeningChannel(dummySocket, channel)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].channels.length).toBe(1)
		expect(connectionManager.getConnections()[0].channels[0]).toBe(channel)

		connectionManager.removeListeningChannel(dummySocket, channel)
		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
		expect(connectionManager.getConnections()[0].channels.length).toBe(0)
	})

	test('I should be able to remove a connection if there is one', () => {
		expect(connectionManager.getConnections().length).toBe(0)

		connectionManager.registerConnection(dummySocket)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
		expect(connectionManager.getConnections()[0].channels.length).toBe(0)

		connectionManager.removeConnection(dummySocket)

		expect(connectionManager.getConnections().length).toBe(0)
	})

	test('I should be able to remove specified connections if I have multiple', () => {
		expect(connectionManager.getConnections().length).toBe(0)

		connectionManager.registerConnection(dummySocket)
		let copy = {
			...dummySocket
		}
		copy.id = 0
		connectionManager.registerConnection(copy)

		expect(connectionManager.getConnections().length).toBe(2)
		expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
		expect(connectionManager.getConnections()[0].channels.length).toBe(0)
		expect(connectionManager.getConnections()[1].id).toBe(copy.id)
		expect(connectionManager.getConnections()[1].channels.length).toBe(0)

		connectionManager.removeConnection(dummySocket)

		expect(connectionManager.getConnections().length).toBe(1)
		expect(connectionManager.getConnections()[0].id).toBe(copy.id)
		expect(connectionManager.getConnections()[0].channels.length).toBe(0)
	})
})
