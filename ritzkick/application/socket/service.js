const axios = require('axios').default
const chalk = require('chalk')

class Service {
    
    constructor(room, url, config) {
        this.url = url
        this.room = room
        this.config = config
        this.running = false
        this.lastData = []
        this.query = []
        this.routine = undefined
        this.callback = undefined
        this.cleanupCallback = undefined
        this.appendUrlData = ''
    }

    queryField() {
        return this.query
    }

    latestData() {
        return this.cleanupCallback(this.lastData)
    }

    cleanCallback(callback) {
        this.cleanupCallback = callback
    }

    setAppendData(data) {
        this.appendUrlData = data
    }

    listenCallback(callback) {
        this.callback = callback
    }

    setConfig(config) {
        this.config = config
    }

    /**
     * Run the service
     */
    run() {
        if (this.running) return
        log('Service', 'Running service for ' + this.room.name)
        this.running = true
        this.routine = setInterval(() => {
            axios({
                url: this.url + this.query + this.appendUrlData,
                signal: !this.running,
                ...this.config
            })
            .then(res => {
                this.lastData = res.data
                this.callback(this.room, this.latestData())
            })
            .catch(_ => {
                this.callback(this.room, this.latestData())
            })
        }, 1000)
    }

    /**
     * Stop the service
     */
    stop() {
        if (!this.running) return
        this.running = false
        log('Service', 'Stopping service for ' + this.room.name)
        clearInterval(this.routine)
    }

}

const log = (title, message) => {
    console.log(chalk.hex('#eeba30')(`[${title}]:`), chalk.hex('#fffaf0')(message))
}


module.exports = Service