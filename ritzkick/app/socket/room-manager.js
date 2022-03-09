const Room = require('./room')
const handler = require('./utils/handler')

// -------------
// List of all rooms
// -------------
const rooms = []

const initialization = () => {
	rooms.length = 0
}

const add = (room, graph = false) => {
	rooms.push(new Room(room, graph))
}

const total = () => {
	return rooms.length
}

const aliveRooms = () => {
	return [...rooms].filter(room => room.hasClients())
}

const activePortfolioRooms = () => {
	return aliveRooms().filter(room => room.name.toLowerCase().startsWith('dash-'))
}


/**
 * Remove the socket from his rooms
 * @param {socket} socket
 */
const disconnect = (socket) => {
	rooms.forEach((room) => {
		if (room.remove(socket)) {
			handler.onLeftRoom(room)
		}
	})
}

const disconnectFromRoom = (socket, roomName) => {
	const room = getRoom(roomName)
	if (room.remove(socket)) {
		handler.onLeftRoom(room)
	}
}

/**
 * Get the clients from a specific room
 * @param {string} room
 * @returns list of all clients
 */
const getClientsFromRoom = (room) => {
	let _ = getRoom(room)
	return _.clients
}

/**
 * Get all rooms of the socket
 * @param {number} id
 * @returns a list of all the rooms the socket belongs
 */
const getRoomsOfSocket = (id) => {
	return rooms.filter((room) => room.hasClient(id))
}

const getClient = (id) => {
	let rooms = getRoomsOfSocket(id)
	if (!rooms) return undefined
	let client = getRoom(rooms[0].name).getClient(id)
	return client
}

const getRoom = (name) => {
	return rooms.find((room) => room.name === name)
}

module.exports = {
	initialization,
	add,
	total,
	aliveRooms,
	disconnectFromRoom,
	getClientsFromRoom,
	getRoom,
	disconnect,
	getRoomsOfSocket,
	getClient,
	activePortfolioRooms
}
