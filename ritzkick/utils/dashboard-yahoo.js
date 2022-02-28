/**
 * Map yahoo's graph response to 
 * @param {list} data list of all the data from yahoo's response.
 * @param {list} transactions list of all transactions from the user.
 * @returns formated values for the dashboard
 */
const yahooToDashBoard = async (data = [], transactions = []) => {
    if (data.length === 0) return []

    // Dummy values
    transactions.push({
        owner: '1',
        wallet: '1',
        asset: 'eth',
        when: '2022-02-25',
        amount: .7
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        asset: 'eth',
        when: '2022-02-28',
        amount: .04
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        asset: 'eth',
        when: '2022-02-27',
        amount: .1
    })

    transactions.push({
        owner: '1',
        wallet: '1',
        asset: 'eth',
        when: '2022-02-26',
        amount: .4
    })
    
    transactions = orderByDate(transactions)

    let res = []
    let parsed = data[0].response[0]

    let prices = parsed.indicators.quote[0].close
    let currentPrice = prices[prices.length - 1]
    let timestamp = parsed.timestamp

    let exist = false
    timestamp.forEach((element, index) => {
        let found = transactions.find(trans => trans.when.includes(element))
        if (found) {
            exist = true
            prices[index] = found
            continue
        }
        if (!exist)
            prices[index] = 0
    })


    
    console.log(parsed, currentPrice)
    return res
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
    yahooToDashBoard
}