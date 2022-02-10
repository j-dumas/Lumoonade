const io = require('socket.io')
const fm = require('./fetch-manager')
const cm = require('./connection-manager')
let serverSocket = undefined

/**
 * This is for the initialization of the websocket.
 * @param {httpServer} server 
 */
const initialize = (server) => {
    // binding the websocket to the server.
    serverSocket = io(server)
    serverSocket.on('connection', (socket) => {

        // verify for bad actors.
        verifyIncomingSocket(socket)
        socket.emit('welcome')
        console.log(socket.id)        
        
        // assign the incoming socket to a lobby and to the connection manager .
        cm.registerConnection(socket)
        socket.handshake.auth.token.forEach(session => {
            cm.registerListeningChannel(socket, session.toLowerCase().trim())
            socket.join(session.toLowerCase().trim())
        })

        // updating the fetch query and running the service.
        fm.updateFetch()
        fm.run(undefined, (data) => {
            data.forEach(curr => {
                serverSocket.to(curr.symbol.toLowerCase().trim()).emit('priceChange', curr)
            })
        })

        // listen to remove any socket when they quit.
        socket.on('disconnect', () => {
            cm.removeConnection(socket)
            console.log('Remain:', cm.getConnections())
            if (cm.getActiveConnections() === 0)
                fm.stop()
        })
    })
}

/**
 * This removes invalid websockets (CLIENT).
 * @param {Socket} socket 
 */
const verifyIncomingSocket = (socket) => {
    const { handshake } = socket
    if(!handshake.url.includes('socket.io/?') || handshake.auth.token.length === 0) socket.disconnect()
}

module.exports = {
    initialize
}