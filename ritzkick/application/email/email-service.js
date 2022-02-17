const Client = require('socket.io-client')
const Watchlist = require('../../db/model/watchlist')
const User = require('../../db/model/user')
const parser = require('../socket/utils/parser')
const logger = require('../../utils/logging')
const chalk = require('chalk')
const email = require('../email/email')

let client = undefined
let listen = undefined

const create = async () => {
    if (client) {
        client.close()
    }
    const watchlists = await Watchlist.find({})
    if (watchlists.length === 0) {
        return log('Client', `No connection made!`) 
    }
    listen = parser.rebuild(watchlists.map(w => w.slug))
    log('Client', 'Found ' + watchlists.length + ' lists with ' + listen.length + ' unique search.')
    client = new Client(`${(process.env.SSL == 'false') ? 'http' : 'https'}://${process.env.NEXT_PUBLIC_HTTPS}:${process.env.NEXT_PUBLIC_PORT}/`, {
        auth: {
            // @TODO unique room?.
            rooms: ['general'],
            query: listen,
            graph: false
        }
    })

    client.on('ready', (_) => {
        log('Client', 'Email Client is connected!')
    })

    client.on('reject', (_) => {
        log('Client', 'Email Client got rejected.')
    })

    client.on('data', (data) => {
        data.forEach(d => {
            tracker(d.symbol.toLowerCase(), d.regularMarketPrice)
        })
    })

}

const tracker = async (slug, price) => {
    const gteInterest = await Watchlist.find({ slug, parameter: 'gte' }).where('target').lte(price)
    const lteInterest = await Watchlist.find({ slug, parameter: 'lte' }).where('target').gte(price)
    handleTracker(gteInterest, price)
    handleTracker(lteInterest, price)
}

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

const notifyAdd = async (element) => {

    if (!client || client.disconnected) {
        return await create()
    }

    if (client && listen) {
        listen = parser.appendToList(listen, [element])
        client.emit('update', client.id, listen)
    }
}

const notifyRemove = async () => {
    if (client.connected) {
        const watchlists = await Watchlist.find({})
        if (watchlists.length === 0) {
            kill()
            return log('Client', `Left ${!client.connected}`) 
        }
        listen = parser.rebuild(watchlists.map(w => w.slug))
        console.log(listen)
        return client.emit('update', client.id, listen)
    }
    await create()
}

const kill = () => {
    if (client) {
        client.close()
    }
}

function log(auth, message) {
    console.log(chalk.hex('#abcdef')(`[${auth}]:`), chalk.whiteBright(message))
}

module.exports = {
    create,
    notifyAdd,
    notifyRemove,
    kill
}