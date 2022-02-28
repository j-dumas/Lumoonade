const roomManager = require('../../app/socket/room-manager')
const handler = require('../../app/socket/utils/handler')

let onUpdateCalled, onLeftRoomCalled

handler.onUpdate = () => {
    onUpdateCalled = true
}

handler.onLeftRoom = () => {
    onLeftRoomCalled = true
}

beforeEach(() => {
    onLeftRoomCalled = false
    onUpdateCalled = false
    roomManager.initialization()  
})

describe(`All tests related to the room manager`, () => {
    
    const CHANNEL_NAME = 'general'

    test(`You can create a room called 'general'`, () => {
        let room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).toBeUndefined()

        roomManager.add(CHANNEL_NAME)
        room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).not.toBeUndefined()
        expect(room.name).toBe(CHANNEL_NAME)
    })

    test(`You can create a room called 'general' with a graph property`, () => {
        let room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).toBeUndefined()

        roomManager.add(CHANNEL_NAME, true)
        room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).not.toBeUndefined()
        expect(room.name).toBe(CHANNEL_NAME)
        expect(room.graph).toBeTruthy()
    })

    test(`If you have multiple rooms with the same name, getRoom will return the first one created.`, () => {
        let room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).toBeUndefined()
        // first one added contains a graph call
        roomManager.add(CHANNEL_NAME, true)

        for (let i = 0; i < 10; i++) {
            roomManager.add(CHANNEL_NAME)
        }

        room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).not.toBeUndefined()
        expect(room.name).toBe(CHANNEL_NAME)
        expect(room.graph).toBeTruthy()
    })

    test(`If you don't have a client connected to a specific room, you should not remove him`, () => {
        let room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).toBeUndefined()
        roomManager.add(CHANNEL_NAME)
        room = roomManager.getRoom(CHANNEL_NAME)
        // mocking the call
        room.remove = () => { return false }

        // this is a websocket
        let client = {}
        roomManager.disconnect(client)
        expect(onLeftRoomCalled).toBeFalsy()
    })

    test(`If you have a client connected to a specific room, you should be able to remove him`, () => {
        let room = roomManager.getRoom(CHANNEL_NAME)
        expect(room).toBeUndefined()
        roomManager.add(CHANNEL_NAME)
        room = roomManager.getRoom(CHANNEL_NAME)
        // mocking the call
        room.remove = () => { return true }

        // this is a websocket
        let client = {}
        roomManager.disconnect(client)
        expect(onLeftRoomCalled).toBeTruthy()
    })

})