const moment = require('moment')
const graph = require('app/socket/utils/graph')

const yahooToDashBoard2 = (data = [], transactions = [], range, single = true, timezone = 'America/Toronto') => {
	if (data.length === 0 || transactions.length === 0) return []

	transactions = orderByDate(transactions)

	if (single) {
		data.forEach((entry) => yahooToDashBoard(entry, fromSymbol(entry.symbol, transactions), range, timezone))
		let timestamps = data[0].response[0].timestamp
		timestamps.forEach((_, index) => {
			let priceSum = 0
			data.forEach((entry) => {
				let price = entry.response[0].indicators.quote[0].close[index]
				priceSum += price
			})
			data[0].response[0].indicators.quote[0].close[index] = priceSum
		})
		data[0].symbol = 'dashboard'
		return [data[0]]
	}

	data.forEach(entry => yahooToDashBoard(entry, fromSymbol(entry.symbol, transactions), range, timezone))
}

const fromSymbol = (symbol, transactions) => {
	return transactions.filter((transac) => symbol.toLowerCase().includes(transac.asset))
}

/**
 * Map yahoo's graph response to
 * @param {list} data list of all the data from yahoo's response.
 * @param {list} transactions list of all transactions from the user.
 * @returns formated values for the dashboard
 */
const yahooToDashBoard = async (data = [], transactions = [], range, timezone) => {
	if (data.length === 0 || transactions.length === 0) return []

	transactions = orderByDate(transactions)

	let res = []
	let parsed = data.response[0]

	let prices = parsed.indicators.quote[0].close
	let timestamps = parsed.timestamp

	timestamps.forEach((timestamp, index) => {
		prices[index] = prices[index] * amountOfAssetsAtDate(timestamp, transactions)
		timestamps[index] = graph.getDateFormat(range, timestamp, timezone)
	})

	return res
}

const amountOfAssetsAtDate = (timestamp, transactions) => {
	let amount = 0
	transactions.find((transac) => {
		if (dateDiff(transac.when, moment(timestamp).format('YYYY-MM-DD')) <= 0) {
			amount += transac.amount
		} else {
			return true
		}
	})
	return amount
}

const dateDiff = (date, comp) => {
	return moment(date).diff(moment(comp), 'days')
}

const orderByDate = (transactions = []) => {
	if (transactions.length === 0) return []

	let copy = [...transactions]
	return copy.sort((a, b) => {
		return Date.parse(a.when) - Date.parse(b.when)
	})
}

module.exports = {
	yahooToDashBoard2
}
