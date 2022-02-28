const connectionManager = require('../../app/socket/connection-manager')

beforeEach(() => {
    connectionManager.clean()
})

describe(`All tests related to the connection-manager`, () => {
    
    let dummySocket = {
        id: 1
    }

    test('On creation, you should not have any connections', () => {
        expect(connectionManager.getConnections().length).toBe(0)
    })

    test('If the socket does not exist in the connections, you can add it', () => {
        expect(connectionManager.getConnections().length).toBe(0)

        connectionManager.registerConnection(dummySocket)

        expect(connectionManager.getConnections().length).toBe(1)
        expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
    })

    test('If the socket does exist in the connections, you can not add it', () => {
        expect(connectionManager.getConnections().length).toBe(0)

        connectionManager.registerConnection(dummySocket)
        
        expect(connectionManager.getConnections().length).toBe(1)
        expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)

        connectionManager.registerConnection(dummySocket)
        expect(connectionManager.getConnections().length).toBe(1)
    })

    test('You can set a connection a channel to listen to', () => {
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

    test('You can remove a channel from a connection', () => {
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

    test('You can remove a connection if there is one', () => {
        expect(connectionManager.getConnections().length).toBe(0)

        connectionManager.registerConnection(dummySocket)
        
        expect(connectionManager.getConnections().length).toBe(1)
        expect(connectionManager.getConnections()[0].id).toBe(dummySocket.id)
        expect(connectionManager.getConnections()[0].channels.length).toBe(0)

        connectionManager.removeConnection(dummySocket)

        expect(connectionManager.getConnections().length).toBe(0)
    })

    test('if you have multiple connections, it should remove the only one specified', () => {
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