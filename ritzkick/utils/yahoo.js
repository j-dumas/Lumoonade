const axios = require('axios').default
const moment = require('moment')
const api = process.env.YAHOO_API

const parser = (data, options = { symbol: true, type: true, currency: true, timestamps: true, prices: true, change: true }) => {
    const response = { }    
    const { meta, timestamp, indicators } = data.response[0]
    const quotes = indicators.quote[0].close
    response.symbol = data.symbol
    if (meta) {
        response.type = meta.instrumentType
        response.currency = meta.currency
    }

    if (timestamp)
        response.timestamps = timestamp.map(unix => moment.unix(unix).format('hh:mm:ss A'))

    if (indicators)
        response.prices = quotes

    if (options.change) {
        response.change = ((quotes[quotes.length - 1] / quotes[0]) - 1) * 100
        
        let fromDate = moment.unix(timestamp[0])
        let toDate = moment.unix(timestamp[timestamp.length - 1])

        response.data = {
            from: {
                date: fromDate.format('YYYY-MM-DD'),
                time: fromDate.format('hh:mm:ss A')
            },
            to: {
                date: toDate.format('YYYY-MM-DD'),
                time: toDate.format('hh:mm:ss A')
            }
        }
    }
    
    // Removing what we dont care in the response
    Object.keys(options).forEach(option => {
        if (!options[option]) {
            delete response[option]
        }
    })

    return response
}

// --------------------------------------
//   The symbol must be something available on yahoo finance
// --------------------------------------
const fetchSymbol = async (symbol, { range = '1d', interval = '1h' } = {}) =>{
    let response = await axios({
        url: `${api}symbols=${symbol}&range=${range}&interval=${interval}&corsDomain=ca.finance.yahoo.com&.tsrc=finance`,
        method: 'GET',
    })
    if (!response.data || response.data.length === 0) {
        throw new Error('Unable to find data in the response.')
    }
    const { result, error } = response.data.spark
    if (error !== null) {
        return { error: error.code }
    }
    return result
}

const fetchSymbols = async (symbols = [], options = { range: '1d', interval: '1h' }) => {
    if (symbols.length === 0) {
        return []
    }
    let query = symbols.toString().split(' ').join(',')
    return fetchSymbol(query, options)
}

module.exports = {
    fetchSymbol,
    fetchSymbols,
    parser
}