const io = require('socket.io-client')

export function createSocket(rooms, queries, url) {
	const webSocket = io(url, {
		auth: {
			rooms: rooms,
			query: queries
		}
	})
	return webSocket
}
