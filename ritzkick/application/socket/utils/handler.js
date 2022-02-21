const parser = require('./parser')

/**
 * This handler resets the query of the service in a specific room.
 * @param {Room} room
 */
const onLeftRoom = (room) => {
	let service = room.getService()
	onUpdate(room)
	if (!room.hasClients()) {
		service.stop()
	}
}

const onUpdate = (room) => {
	let service = room.getService()
	let clients = room.clients

	let clientQuery = []
	clients.forEach((client) => {
		clientQuery.push(client.query.map(x => String(x).toLowerCase()).flat())
		clientQuery = parser.rebuild(clientQuery.flat())
	})
	service.query = clientQuery
}

module.exports = {
	onLeftRoom,
	onUpdate
}
