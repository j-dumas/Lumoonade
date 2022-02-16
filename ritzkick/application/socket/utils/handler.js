const parser = require('./parser')

/**
 * This handler resets the query of the service in a specific room.
 * @param {Room} room
 */
const onLeftRoom = (room) => {
	let service = room.getService()
	let clients = room.clients

	let clientQuery = []
	clients.forEach((client) => {
		clientQuery.push(client.query.flat())
		clientQuery = parser.rebuild(clientQuery.flat())
	})
	room.getService().query = clientQuery

	if (!room.hasClients()) {
		service.stop()
	}
}

module.exports = {
	onLeftRoom
}
