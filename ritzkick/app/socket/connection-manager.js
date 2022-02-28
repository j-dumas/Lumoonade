// List of all connections
let connections = []

/**
 * Clean the connections array
 */
const clean = () => {
	connections.length = 0
}

/**
 * Register a new connection to the active connections list
 * @param {socket} socket
 */
const registerConnection = (socket) => {
	if (getConnectionFromSocket(socket)) return
	connections.push({
		id: socket.id,
		channels: []
	})
}

/**
 * Register the socket to a specific listening channel.
 * @param {socket} socket
 * @param {string} join name of the channel to join.
 */
const registerListeningChannel = (socket, join) => {
	let user = getConnectionFromSocket(socket)
	if (user) user.channels.push(join.toLowerCase().trim())
}

/**
 * Delete the socket from the active connections list.
 * @param {socket} socket
 */
const removeConnection = (socket) => {
	connections = connections.filter((connection) => connection.id !== socket.id)
}

/**
 * Removes the socket from listening a specific channel
 * @param {socket} socket
 * @param {string} quitting name of the quitting channel.
 */
const removeListeningChannel = (socket, quitting) => {
	let user = getConnectionFromSocket(socket)
	user.channels = user.channels.filter((channel) => channel !== quitting.toLowerCase().trim())
}

/**
 * Get the connection that matches the socket.
 * @param {socket} socket
 * @returns the object that matches the socket.
 */
const getConnectionFromSocket = (socket) => {
	return connections.find((connection) => connection.id === socket.id)
}

/**
 * Get the list of all current connections.
 * @returns the list of all connections.
 */
const getConnections = () => {
	return connections
}

/**
 * Get the amount of active connections.
 * @returns the length of active connections.
 */
const getActiveConnections = () => {
	return connections.length
}

/**
 * Get the amount of active connections from a specific channel name.
 * @param {string} channel name of the channel.
 * @returns a number of occurence that were found in this channel.
 */
const getActiveConnectionsInChannel = (channel) => {
	return connections.filter((connection) => connection.channels.find(channel)).length
}

/**
 * Get a unique list of all names from all the listening channels.
 * @returns a list of unique channel names.
 */
const getAllListeningChannels = () => {
	return [...new Set(connections.map((connection) => connection.channels).flat())]
}

module.exports = {
	registerConnection,
	registerListeningChannel,
	removeConnection,
	removeListeningChannel,
	getConnections,
	getActiveConnections,
	getActiveConnectionsInChannel,
	getAllListeningChannels,
	clean
}
