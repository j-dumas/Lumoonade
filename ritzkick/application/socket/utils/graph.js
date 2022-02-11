const rm = require('../room-manager')
const Service = require('../service')
const parser = require('./parser')

// Adding combinaisons array with slice soon
// let combinaisons = ['1m', '2m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo', '3mo']

/**
 * List of all available combinaisons
 */
const graphRoom = {
    '1d': ['1m', '2m', '5m', '15m', '30m', '1h'],
    '5d': ['1m', '2m', '5m', '15m', '30m', '1h', '1d'],
    '1mo': ['2m', '5m', '15m', '30m', '1h', '1d', '1wk'],
    '3mo': ['1h', '1d', '1wk', '1mo'],
    '6mo': ['1h', '1d', '1wk', '1mo', '3mo'],
    '1y': ['1h', '1d', '1wk', '1mo', '3mo'],
    '2y': ['1h', '1d', '1wk', '1mo', '3mo'],
    '5y': ['1d', '1wk', '1mo', '3mo']
}

let url = process.env.YAHOO_API+'spark?symbols='

/**
 * This method populates the room manager with all combinaisons from 'graphRoom'
 */
const populate = () => {
    // Looping thru all key values
    Object.keys(graphRoom).forEach(room => {
        graphRoom[room].forEach(x => {

            // Creating the room
            let roomName = `graph-${room}-${x}` 
            rm.add(roomName)
            let r = rm.getRoom(roomName)

            // Binding a service to the room
            r.setService(new Service(r, url, {
                method: 'GET'
            }))

            // Binding a callback that cleans the value before sending it to the user.
            r.getService().cleanCallback((data) => {
                if (data.length === 0) return data
                return data.spark.result
            })

            // Binding a callback when a value is retrieved from the service.
            r.getService().listenCallback((room, data) => {
                room.clients.forEach(client => {
                    const result = parser.keepFromList(data, {
                        searchTerm: 'symbol',
                        keep: client.query
                    })
                    client.socket.emit('graph', result)
                })
            })

            // Appending the extra value to the url
            r.getService().setAppendData(`&range=${room}&interval=${x}&corsDomain=ca.finance.yahoo.com&.tsrc=finance`)
        })
    })
}

module.exports = {
    populate
}