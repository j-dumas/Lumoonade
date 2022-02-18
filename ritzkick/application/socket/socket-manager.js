const io = require('socket.io')
const parser = require('./utils/parser')
const graphRoom = require('./utils/graph')
const rm = require('./room-manager')
const Service = require('./service')
const log = require('../../utils/logging')

let serverSocket = undefined

/**
 * This is for the initialization of the websocket.
 * @param {httpServer} server
 */
const initialize = (server) => {
	// binding the websocket to the server.
	serverSocket = io(server)

	rm.initialization()

	graphRoom.populate()

	// General Channel for general data
	rm.add('general')
	let general = rm.getRoom('general')
	general.setService(
		new Service(general, process.env.YAHOO_API + 'quote?&symbols=', {
			method: 'GET'
		})
	)

	general.getService().cleanCallback((data) => {
		if (data.length === 0) return data
		return data.quoteResponse.result
	})

	// ---------------------------------------
	// This is the callback of all calls made to the 'general' api
	// and then it emits the result to all sockets in the room
	// ---------------------------------------
	general.getService().listenCallback((room, data) => {
		room.clients.forEach((client) => {
			// Keeping what the client asked for
			const result = parser.keepFromList(data, {
				searchTerm: 'symbol',
				keep: client.query
			})
			client.socket.emit('data', result)
		})
	})

	serverSocket.on('connection', (socket) => {
		// ---------------------------------------
		// Verify if the incoming socket is valid.
		// We notify him after if he passed the test
		// ---------------------------------------
		verifyIncomingSocket(socket)
		socket.emit('ready')

		// ---------------------------------------
		// On join, we make sure everything is okay and run the proper services
		// ---------------------------------------
		const { rooms, query, append, graph } = socket.handshake.auth
		connectionProcess(socket, rooms, query, append, graph)

		// ---------------------------------------
		// This is used to update the query list of a socket
		// ---------------------------------------
		socket.on('update', (id, query) => {
			log.info('Update', `Updating values for ${id}`)
			let rooms = rm.getRoomsOfSocket(id)
			rooms.forEach((room) => {
				let alone = room.clients.length === 1
				let service = room.getService()
				if (!alone) {
					service.query = parser.appendToList(service.query, query)
					service.query = service.query.flat()
				} else {
					service.query = query
				}
				room.modifyClient(id, { query })
				socket.handshake.auth.query = query
			})
			socket.emit('executed')
		})

		// ---------------------------------------
		// This is used to switch rooms
		// ---------------------------------------
		socket.on('switch', (id, newRoom, graph) => {
			if (!id) return
			log.info('Switch', `${id} is switching room`)
			let client = rm.getClient(id)
			if (!client) {
				return log.error('Switch', `${id} failed to switch`)
			}
			const { query } = client
			const { append } = socket.handshake.auth
			let socketRooms = rm.getRoomsOfSocket(id)
			socketRooms = socketRooms.filter((r) => !newRoom.find((e) => e === r.name))
			socketRooms.forEach((room) => {
				socket.leave(room.name)
				rm.disconnectFromRoom(socket, room.name)
			})
			connectionProcess(socket, newRoom, query, append, graph)
		})

		// ---------------------------------------
		// Making sure that everything is removed on disconnect
		// ---------------------------------------
		socket.on('disconnect', () => {
			rm.disconnect(socket)
		})
	})
}

const connectionProcess = (socket, rooms, query, append, graph) => {
	rooms.forEach((room) => {
		let r = rm.getRoom(room)
		if (r) {
			if (r.append(socket)) {
				log.info('Server', `${socket.id} is new to the room ${r.name}`)
				socket.join(room)
				if (append) {
					r.getService().setAppendData(append)
				}

				socket.emit((r.graph) ? 'graph' : 'data', r.getService().latestData())

				r.getService().query = parser.appendToList(r.getService().query, query)
				r.getService().query = r.getService().query.flat()
				r.getService().run()
			} else {
				log.error('Server', `${socket.id} failed to join ${r.name}`)
			}
		}
	})
	socket.emit('executed')
}

/**
 * This removes invalid websockets (CLIENT).
 * @param {Socket} socket
 */
const verifyIncomingSocket = (socket) => {
	const { handshake } = socket
	if (!handshake.url.includes('socket.io/?') || handshake.auth.rooms.length === 0) {
		socket.emit('reject')
		socket.disconnect()
	}
}

/**
 * This is used for unit testing
 */
const close = () => {
	if (serverSocket) {
		serverSocket.close()
	}
}

module.exports = {
	initialize,
	close
}
