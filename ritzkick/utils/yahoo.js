const axios = require('axios').default
const validator = require('validator').default
const api = process.env.YAHOO_API

/**
 * Parse data to a 'feed' list
 * @param {list} data whatever data in a list
 * @param {list} feed whatever data we want to keep
 */
const parser = (data, feed) => {
	Object.keys(feed).forEach((x) => {
		feed[x] = data[x]
	})
}

/**
 * Fetch data from all symbols in the list
 * @param {list} symbols list of symbols to fetch data from
 * @param {object} param1 options as an object
 * @returns all informations for a graph
 */
const fetchSymbol = async (symbols, { range = '1d', interval = '1h' } = {}) => {
	let response = await axios({
		url: `${api}spark?symbols=${symbols}&range=${range}&interval=${interval}&corsDomain=ca.finance.yahoo.com&.tsrc=finance`,
		method: 'GET'
	})
	return response.data.spark.result
}

/**
 * Fetch market datas from a list of symbols
 * @param {list} symbols list of symbols
 * @returns market data from all symbols
 */
const fetchMarketData = async (symbols) => {
	if (validator.isEmpty(symbols)) return { result: [] }
	let query = await axios({
		url: `${api}quote?&symbols=${symbols}`,
		method: 'GET'
	})
	return query.data.quoteResponse
}

module.exports = {
	fetchSymbol,
	fetchMarketData,
	parser
}
