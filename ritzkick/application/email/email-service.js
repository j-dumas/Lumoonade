const Client = require('socket.io-client')
const Watchlist = require('../../db/model/watchlist')
const parser = require('../socket/utils/parser')
const logger = require('../../utils/logging')

let client = undefined

const create = async () => {
    // client = new Client(`${window.location.protocol}//${window.location.host}`, {
    //     auth: {
    //         // @TODO unique room?.
    //         rooms: ['general'],
    //         query: [],
    //         graph: false
    //     }
    // })

    // client.on('ready', (_) => {
    //     logger.info('Email Client is connected!')
    // })

    // client.on('reject', (_) => {
    //     logger.warn('Email Client got rejected.')
    // })
}

const notify = async () => {
    if (client) {
        client.emit('update', client.id, list)
    }
}

(async () => {
    await create()
})()

module.exports = {
    create,
    notify
}