const Room = require('./room')
const chalk = require('chalk')

// -------------
// List of all rooms
// -------------
const rooms = []

const initialization = () => {
	rooms.length = 0
}

const add = (room) => {
	rooms.push(new Room(room))
}

const remove = (room) => {
	console.log(rooms)
}

/**
 * Remove the socket from his rooms
 * @param {socket} socket
 */
const disconnect = (socket) => {
	rooms.forEach((room) => {
		if (room.remove(socket)) {
			log('Room Manager', `${socket.id} removed from room ${room.name}`)
			if (!room.hasClients()) {
				room.getService().stop()
			}
		}
	})
}

const disconnectFromRoom = (socket, roomName) => {
	const room = getRoom(roomName)
	if (room.remove(socket)) {
		log('Room Manager', `${socket.id} removed from room ${room.name}`)
		if (!room.hasClients()) {
			room.getService().stop()
		}
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

const log = (title, message) => {
	console.log(chalk.hex('#4f38ff')(`[${title}]:`), chalk.hex('#fffaf0')(message))
}

module.exports = {
	initialization,
	add,
	remove,
	disconnectFromRoom,
	getClientsFromRoom,
	getRoom,
	disconnect,
	getRoomsOfSocket,
	getClient
}
