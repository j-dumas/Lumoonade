const io = require('socket.io-client')
const URL = 
`${process.env.NEXT_PUBLIC_SSL == 'false' ? 'ws' : 'wss'}://${process.env.NEXT_PUBLIC_HTTPS}:${process.env.NEXT_PUBLIC_PORT}/`
export function createSocket(rooms, queries) {
	const webSocket = io(URL, {
		auth: {
			rooms: rooms,
			query: queries
		}
	})
	return webSocket
}