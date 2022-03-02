const moment = require('moment')
const graph = require('app/socket/utils/graph')

const yahooToDashBoard2 = async (data = [], transactions = [], range, single = false) => {
    if (data.length === 0) return []

    // Dummy values ETH
    // transactions.push({
    //     owner: '1',
    //     wallet: '1',
    //     name: 'eth',
    //     when: '2021-02-26',
    //     amount: 1.7
    // })

    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'eth',
        when: '2022-02-26',
        amount: .7
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'eth',
        when: '2022-03-01',
        amount: .04
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'eth',
        when: '2022-02-28',
        amount: .1
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'eth',
        when: '2022-02-27',
        amount: .4
    })

    // Dummy values BTC
    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'btc',
        when: '2022-02-26',
        amount: .001
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'btc',
        when: '2022-03-01',
        amount: .04
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'btc',
        when: '2022-02-28',
        amount: .05
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        name: 'btc',
        when: '2022-02-27',
        amount: .02
    })

    transactions = orderByDate(transactions)

    if (single) {
        // map one timestamp
        // map two state
        // add values
        data.forEach(entry => {
            yahooToDashBoard(entry, fromSymbol(entry.symbol, transactions), range)
        })
        data = [ data[0] ]
        return
    }

    data.forEach(entry => {
        yahooToDashBoard(entry, fromSymbol(entry.symbol, transactions), range)
    })
}

const fromSymbol = (symbol, transactions) => {
    return transactions.filter(transac => symbol.toLowerCase().includes(transac.name))
}

/**
 * Map yahoo's graph response to 
 * @param {list} data list of all the data from yahoo's response.
 * @param {list} transactions list of all transactions from the user.
 * @returns formated values for the dashboard
 */
const yahooToDashBoard = async (data = [], transactions = [], range) => {
    if (data.length === 0 || transactions.length === 0) return []
    
    transactions = orderByDate(transactions)

    let res = []
    let parsed = data.response[0]

    let prices = parsed.indicators.quote[0].close
    let timestamps = parsed.timestamp

    timestamps.forEach((timestamp, index) => {
        prices[index] = prices[index] * amountOfAssetsAtDate(timestamp, transactions)
        timestamps[index] = graph.getDateFormat(range, timestamp)
    })

    return res
}

const amountOfAssetsAtDate = (timestamp, transactions) => {
    let amount = 0
    transactions.find(transac => {
        if (dateDiff(transac.when, moment(timestamp).format('YYYY-MM-DD')) <= 0) {
            amount += transac.amount
        } else { return true }
    })
    return amount
}

const amountByDate = (transactions) => {
    let copy = [...transactions]
    for (let i = 1; i < copy.length; i++) {
        copy[i].amount += copy[i - 1].amount 
    }
    return copy
}

const minimDate = (timestamp, minDate) => {
    let a = moment(timestamp).format('YYYY-MM-DD')
    return dateDiff(minDate.when, a) >= 0
}

const isDate = (date, comp) => {
    let b = moment(comp).format('YYYY-MM-DD')
    return dateDiff(date, b) === 0
}

const dateDiff = (date, comp) => {
    return moment(date).diff(moment(comp), 'days')
}

const orderByDate = (transactions = []) => {
    if (transactions.length === 0)
        return []
    
    let copy = [...transactions]
    return copy.sort((a, b) => {
        return Date.parse(a.when) - Date.parse(b.when)
    })
}

module.exports = {
    yahooToDashBoard,
    yahooToDashBoard2
}