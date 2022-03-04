const axios = require('axios').default
const validator = require('validator').default
const api = process.env.YAHOO_API

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

module.exports = {
	fetchSymbol,
	fetchMarketData,
	parser
}
