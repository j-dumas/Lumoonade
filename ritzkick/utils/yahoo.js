const axios = require('axios').default
const validator = require('validator').default
const moment = require('moment')
const api = process.env.YAHOO_API

// --------------------------------------
// Can be optimised to be less dependent from old data
// --------------------------------------
const refactorSymbolData = (
	data,
	options = {
		symbol: true,
		type: true,
		currency: true,
		timestamps: true,
		prices: true,
		change: true
	}
) => {
	const response = {}
	const { meta, timestamp, indicators } = data.response[0]
	const quotes = indicators.quote[0].close
	response.symbol = data.symbol
	if (meta) {
		response.type = meta.instrumentType
		response.currency = meta.currency
	}

	if (timestamp)
		response.timestamps = timestamp.map((unix) => moment.unix(unix).utcOffset('+0000').format('hh:mm:ss A'))

	if (indicators) response.prices = quotes

	if (options.change) {
		response.change = (quotes[quotes.length - 1] / quotes[0] - 1) * 100

		let fromDate = moment.unix(timestamp[0])
		let toDate = moment.unix(timestamp[timestamp.length - 1])

		response.data = {
			from: {
				date: fromDate.utcOffset('+0000').format('YYYY-MM-DD'),
				time: fromDate.utcOffset('+0000').format('hh:mm:ss A')
			},
			to: {
				date: toDate.utcOffset('+0000').format('YYYY-MM-DD'),
				time: toDate.utcOffset('+0000').format('hh:mm:ss A')
			}
		}
	}

	// Removing what we dont care in the response
	Object.keys(options).forEach((option) => {
		if (!options[option]) {
			delete response[option]
		}
	})

	return response
}

// --------------------------------------
//  This parser feeds the object received with all the values from the data
// --------------------------------------
const parser = (data, feed) => {
	Object.keys(feed).forEach((x) => {
		feed[x] = data[x]
	})
}

// --------------------------------------
//   **The symbol must be something available on yahoo finance**
//  This function is used to fetch all informations about a "symbol" (not related to the market like volumes, supply, etc...)
// --------------------------------------
const fetchSymbol = async (symbols, { range = '1d', interval = '1h' } = {}) => {
	let response = await axios({
		url: `${api}spark?symbols=${symbols}&range=${range}&interval=${interval}&corsDomain=ca.finance.yahoo.com&.tsrc=finance`,
		method: 'GET'
	})
	return response.data.spark.result
}

// --------------------------------------
//   **The symbols must be something available on yahoo finance**
//  This function is used to get data related to the market like:
//  - The current supply;
//  - The volume;
//  - The market change (% and $)
//  - and much more...
// --------------------------------------
const fetchMarketData = async (symbols) => {
	if (validator.isEmpty(symbols)) return { result: [] }
	let query = await axios({
		url: `${api}quote?&symbols=${symbols}`,
		method: 'GET'
	})
	return query.data.quoteResponse
}

// ---------------------------------------
// This method will tell if the market is closed (only usefull for stocks, not cryptos)
// ---------------------------------------
const isMarketClosed = () => {}

module.exports = {
	fetchSymbol,
	fetchMarketData,
	refactorSymbolData,
	parser
}
