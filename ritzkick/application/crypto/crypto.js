const crypto = require('../../utils/request')

// All APIs for BTC
const btc_contacts = [
    'https://api.coinbase.com/v2/prices/BTC-USD/buy',
    'https://api.pancakeswap.info/api/v2/tokens/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'
]

// All APIs for ETH
const eth_contacts = [
    'https://api.coinbase.com/v2/prices/ETH-USD/buy',
    'https://api.pancakeswap.info/api/v2/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
]

const getPrice = async (contacts) => {
    const controller = new AbortController()
    const data = await crypto.getFastestApiResponse(contacts, controller)
    return data
}

module.exports = {
    btc_contacts,
    eth_contacts,
    getPrice
}