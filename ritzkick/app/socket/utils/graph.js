const rm = require('../room-manager')
const Service = require('../service')
const parser = require('./parser')
const moment = require('moment')
const momentTimeZone = require('moment-timezone')

// This is all the possible values available on finance.yahoo.com.
let combinaisons = ['1m', '2m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo', '3mo']

/**
 * Get the content from a point to another
 * @param {string} from
 * @param {string} to
 * @returns list of all combinaisons in that range.
 */
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
let dashurl = process.env.YAHOO_API_DASH + 'spark?symbols='

/**
 * This method populates the room manager with all combinaisons from 'graphRoom'
 */
const populate = () => {
	// populate for graphs
	Object.keys(graphRoom).forEach((room) => {
		graphRoom[room].forEach((interval) => {
			// Creating the room
			let roomName = `graph-${room}-${interval}`
			let dashRoomName = `dash-graph-${room}-${interval}`
			rm.add(roomName, true)
			rm.add(dashRoomName, true)

			// Getting the rooms
			let r = rm.getRoom(roomName)
			let dr = rm.getRoom(dashRoomName)

			// Binding a service to the room
			const intervalTimeMS = 2500
			r.setService(new Service(r, url, { method: 'GET' }))
			dr.setService(new Service(dr, dashurl, { method: 'GET' }, intervalTimeMS))

			// Binding a callback that cleans the value before sending it to the user.
			r.getService().cleanCallback(cleanupCallback)
			dr.getService().cleanCallback(cleanupCallback)

			// Binding a callback when a value is retrieved from the service.
			r.getService().listenCallback(listenCallback)
			dr.getService().listenCallback(listenCallback)

			// Appending the extra value to the url
			let appendData = `&range=${room}&interval=${interval}&corsDomain=ca.finance.yahoo.com&.tsrc=finance`
			r.getService().setAppendData(appendData)
			dr.getService().setAppendData(appendData)
		})
	})
}

/**
 * This is a custom callback for cleanup purposes
 * @param {list} data yahoo's response
 * @returns cleaned data
 */
const cleanupCallback = (data) => {
	try {
		if (data.length === 0) return data
		data.spark.result.forEach((res) => {
			let quotes = res.response[0].indicators.quote[0].close
			let timestamps = res.response[0].timestamp
			res.response[0].indicators.quote[0].close = quotes.filter((obj, index) => {
				timestamps[index] = !obj ? null : timestamps[index] * 1000
				return obj
			})
			res.response[0].timestamp = timestamps.filter((_) => _)
		})
		return data.spark.result
	} catch (_) {}
}

/**
 * This callback is going to be called whenever we get data from yahoo's api.
 * @param {Room} room Room object
 * @param {list} data yahoo's data
 */
const listenCallback = (room, data = []) => {
	if (data.length === 0) return
	try {
		room.clients.forEach((client) => {
			try {
				const result = parser.keepFromList(data, {
					searchTerm: 'symbol',
					keep: client.query
				})
				client.socket.emit('graph', parser.sortListInSpecificOrder(result, client.query))
			} catch (_) {}
		})
	} catch (_) {}
}

/**
 * Get a specific time format for a specific range graph
 * @param {string} range
 * @param {number} value
 * @returns the formated time for any graph channel
 */
const getDateFormat = (range = '1d', value = new Date().getTime(), timezone = 'America/Toronto') => {
	let formatted = momentTimeZone.tz(new Date(value), timezone)
	switch (range.toLowerCase()) {
		case '1d':
			return formatted.format('DD kk:mm')
		case '5d':
		case '1mo':
			return formatted.format('MM-DD kk:mm')
		case '3mo':
		case '6mo':
			return formatted.format('MM-DD kk')
		case '1y':
		case '2y':
			return formatted.format('YY-MM-DD kk')
		case '5y':
			return formatted.format('YY-MM-DD')
		default:
			return formatted.format('YY-MM-DD kk:mm')
	}
}

/**
 * Adjust yahoo's data with the correct timestamps
 * @param {list} data yahoo's data
 * @param {string} range '1d', '2d', '5d', ...
 * @param {string} timezone timezone
 * @returns data modified with valid dates from the timezone
 */
const adjustDateMiddleware = (data = [], range, timezone) => {
	if (data.length === 0) return
	try {
		data[0].response[0].timestamp.forEach((time, index) => {
			data[0].response[0].timestamp[index] = getDateFormat(range, time, timezone)
		})
		return data
	} catch (_) {}
}

module.exports = {
	populate,
	getDateFormat,
	adjustDateMiddleware
}
