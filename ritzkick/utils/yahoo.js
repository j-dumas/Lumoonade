const axios = require('axios').default
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
        response.timestamps = timestamp

    if (indicators)
        response.prices = quotes

    if (options.change) {
        response.change = ((quotes[quotes.length - 1] / quotes[0]) - 1) * 100
        response.time = {
            from: {
                year: '2020-02-01',
            },
            to: {

            }
        }

        response.from = new Date(timestamp[0] * 1000)
        response.to = new Date(timestamp[timestamp.length - 1] * 1000)
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

(async () => {

    let res = await fetchSymbols(['BTC-CAD', 'ETH-CAD'], { range: '5d' })
    res.forEach(x => {
      console.log(parser(x))
    })
    //console.log(res)
})()