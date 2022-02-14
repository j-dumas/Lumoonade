const chalk = require('chalk')

class Room {
    
    constructor(name) {
        log('Room', `room '${name}' created!`)
        this.name = name
        this.clients = []
        this.service = undefined
    }

    purge() {
        this.clients.length = 0
    }

    setService(service) {
        if (this.service) {
            this.service.stop()
        }
        this.service = service
    }

    getService() {
        return this.service
    }

    append(socket) {
        if (this._exists(socket)) return false
        log('Room', socket.id + ' added to the room ' + `'${this.name}'`)
        this.clients.push({
            id: socket.id,
            socket,
            ...socket.handshake.auth
        })
        this.service.run()
        return true
    }

    getClient(id) {
        return this.clients.find(client => client.id === id)
    }

    hasClients() {
        return this.clients.length > 0
    }

    hasClient(id) {
        return this.clients.filter(client => client.id === id).length > 0
    }

    modifyClient(id, data) {
        let client = this.getClient(id)
        Object.keys(data).forEach(key => {
            client[key] = data[key]
        })
    }

    remove(socket) {
        if(!this._exists(socket)) return false
        this.clients = this.clients.filter(client => client.id !== socket.id)
        return true
    }

    _exists(socket) {
        return this.clients.find(client => client.id === socket.id)
    }
}

const log = (title, message) => {
    console.log(chalk.hex('#eeba30')(`[${title}]:`), chalk.hex('#fffaf0')(message))
}

module.exports = Room