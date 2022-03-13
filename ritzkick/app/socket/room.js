class Room {

	constructor(name, graph = false) {
		this.name = name
		this.clients = []
		this.service = undefined
		this.graph = graph
	}

	/**
	 * Purge all clients from the room.
	 */
	purge() {
		this.clients.length = 0
	}

	setService(service) {
		if (this.service) {
			this.service.stop()
		}
		this.service = service
	}

	/**
	 * Set the room to emit 'graph' calls
	 * @param {boolean} state true or false if this is a graphical room
	 */
	setGraph(state) {
		this.graph = state
	}

	getService() {
		return this.service
	}

	/**
	 * Append a new socket to the room.
	 * @param {socket} socket new socket
	 * @returns true or false if the action succeed.
	 */
	append(socket) {
		if (this._exists(socket)) return false
		this.clients.push({
			id: socket.id,
			socket,
			...socket.handshake.auth
		})
		this.service.run()
		return true
	}

	getClient(id) {
		return this.clients.find((client) => client.id === id)
	}

	hasClients() {
		return this.clients.length > 0
	}

	hasClient(id) {
		return this.clients.filter((client) => client.id === id).length > 0
	}

	modifyClient(id, data) {
		let client = this.getClient(id)
		Object.keys(data).forEach((key) => {
			client[key] = data[key]
		})
	}

	remove(socket) {
		if (!this._exists(socket)) return false
		this.clients = this.clients.filter((client) => client.id !== socket.id)
		return true
	}

	_exists(socket) {
		return this.clients.find((client) => client.id === socket.id)
	}
}

module.exports = Room
