const Client = require('socket.io-client')
const Watchlist = require('../../db/model/watchlist')
const User = require('../../db/model/user')
const parser = require('../socket/utils/parser')
const chalk = require('chalk')
const email = require('../email/email')

let client = undefined
let listen = undefined

const SERVICE_NAME = 'Robot'

/**
 * Create the robot
 */
const create = async () => {
    if (client) {
        client.close()
    }
    const watchlists = await Watchlist.find({})
    if (watchlists.length === 0) {
        return log(SERVICE_NAME, `No connection made!`) 
    }
    listen = parser.rebuild(watchlists.map(w => w.slug))
    log(SERVICE_NAME, 'Found ' + watchlists.length + ' lists with ' + listen.length + ' unique search.')
    
    // This will change in the future.
    const connectionUrl = `${(process.env.SSL == 'false') ? 'http' : 'https'}://${process.env.NEXT_PUBLIC_HTTPS}:${process.env.NEXT_PUBLIC_PORT}/`
    client = new Client(connectionUrl, {
        auth: {
            rooms: ['general'],
            query: listen,
            graph: false
        }
    })

    client.on('ready', (_) => {
        log(SERVICE_NAME, 'Email Client is connected!')
    })

    client.on('reject', (_) => {
        log(SERVICE_NAME, 'Email Client got rejected.')
    })

    client.on('data', (data) => {
        data.forEach(d => {
            tracker(d.symbol.toLowerCase(), d.regularMarketPrice)
        })
    })

}

/**
 * Checks if some alerts must be triggered. If so, it sends an email
 * @param {string} slug slug to filter
 * @param {number} price current slug price
 */
const tracker = async (slug, price) => {
    const gteInterest = await Watchlist.find({ slug, parameter: 'gte' }).where('target').lte(price)
    const lteInterest = await Watchlist.find({ slug, parameter: 'lte' }).where('target').gte(price)
    handleTracker(gteInterest, price)
    handleTracker(lteInterest, price)
}

/**
 * Notifies everyone in the list via 'email'
 * @param {list} list list of people that must be notified
 * @param {number} price current price of the asset
 */
const handleTracker = (list, price) => {
    list.forEach((client) => {
        setTimeout(() => {
            User.findById(client.owner).then(async user => {
                await user.removeWatchlistAlertAndSave(client._id)
                await Watchlist.findOneAndRemove({ _id: client._id, owner: client.owner })
                email.sendWatchlistNotificationMessage({
                    to: user.email,
                    price,
                    asked: client.target,
                    assetName: client.slug
                })
                notifyRemove()
            })
        }, 0)
    })
}

/**
 * Wakes the robot if he was sleeping, otherwise it adds something new to lookup
 * @param {string} element referes as the slug to watch
 */
const notifyAdd = async (element) => {

    if (!client || client.disconnected) {
        return await create()
    }

    if (client && listen) {
        listen = parser.appendToList(listen, [element])
        client.emit('update', client.id, listen)
    }
}

/**
 * Rebuild a new list of things to watch when an alert is removed.
 */
const notifyRemove = async () => {
    if (client.connected) {
        const watchlists = await Watchlist.find({})
        if (watchlists.length === 0) {
            kill()
            return log(SERVICE_NAME, `Left ${!client.connected}`) 
        }
        listen = parser.rebuild(watchlists.map(w => w.slug))
        console.log(listen)
        return client.emit('update', client.id, listen)
    }
    await create()
}

/**
 * Wakes the robot.
 */
const wake = async () => {
    if (client.connected) return
    await create()
}

/**
 * Kills the robot.
 */
const kill = () => {
    if (client) {
        client.close()
    }
}

/**
 * Simple log function for debug | production purposes
 * @param {string} auth authority that sent the message
 * @param {string} message 
 */
function log(auth, message) {
    console.log(chalk.hex('#abcdef')(`[${auth}]:`), chalk.whiteBright(message))
}

module.exports = {
    create,
    notifyAdd,
    notifyRemove,
    kill,
    wake
}