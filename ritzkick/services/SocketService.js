const io = require('socket.io-client')
const URL = `wss://${process.env.NEXT_PUBLIC_URL}:${process.env.NEXT_PUBLIC_PORT}/`
export function createSocket(rooms, queries) {
	const webSocket = io(URL, {
		auth: {
			rooms: rooms,
			query: queries
		}
	})
	return webSocket
}
