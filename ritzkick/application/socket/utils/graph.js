const rm = require('../room-manager')
const Service = require('../service')
const parser = require('./parser')
const moment = require('moment')

// Adding combinaisons array with slice soon
let combinaisons = ['1m', '2m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo', '3mo']

const fromTo = (from, to) => {
	let start = combinaisons.indexOf(from)
	let end = combinaisons.indexOf(to) + 1
	return [...combinaisons.slice(start, end)]
}

/**
 * List of all available combinaisons
 */
const graphRoom = {
	'1d': fromTo('1m', '1h'),
	'5d': fromTo('1m', '1d'),
	'1mo': fromTo('2m', '1wk'),
	'3mo': fromTo('1h', '1mo'),
	'6mo': fromTo('1h', '3mo'),
	'1y': fromTo('1h', '3mo'),
	'2y': fromTo('1h', '3mo'),
	'5y': fromTo('1d', '3mo'),
	max: [...combinaisons]
}

let url = process.env.YAHOO_API + 'spark?symbols='

/**
 * This method populates the room manager with all combinaisons from 'graphRoom'
 */
const populate = () => {
	// Looping thru all key values
	Object.keys(graphRoom).forEach((room) => {
		graphRoom[room].forEach((x) => {
			// Creating the room
			let roomName = `graph-${room}-${x}`
			rm.add(roomName)
			let r = rm.getRoom(roomName)

			// Binding a service to the room
			r.setService(
				new Service(r, url, {
					method: 'GET'
				})
			)

			// Binding a callback that cleans the value before sending it to the user.
			r.getService().cleanCallback((data) => {
				if (data.length === 0) return data
				const timeOffset = 1000
				data.spark.result.forEach((res) => {
					let quotes = res.response[0].indicators.quote[0].close
					res.response[0].indicators.quote[0].close = quotes.filter((obj, index) => {
						if (!obj) {
							res.response[0].timestamp[index] = null
						} else {
							let value = res.response[0].timestamp[index]
							res.response[0].timestamp[index] = moment(value * timeOffset).format('H:mm')
						}
						return obj
					})
					res.response[0].timestamp = res.response[0].timestamp.filter((x) => x)
				})
				return data.spark.result
			})

			// Binding a callback when a value is retrieved from the service.
			r.getService().listenCallback((room, data) => {
				room.clients.forEach((client) => {
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