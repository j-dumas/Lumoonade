const axios = require('axios').default

class Service {
	constructor(room, url, config, ms = 1000) {
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
		this.ms = ms
	}

	isRunning() {
		return this.running
	}

	queryField() {
		return this.query
	}

	latestData() {
		return this.cleanupCallback(this.lastData)
	}

	/**
	 * Bind a function to clean the data whenever axios returns data
	 * @param {function} callback
	 */
	cleanCallback(callback) {
		this.cleanupCallback = callback
	}

	/**
	 * Append more data in the url of your service
	 * @param {string} data append more informations in the url
	 */
	setAppendData(data) {
		this.appendUrlData = data
	}

	/**
	 * Bind a function to be called whenever axios returns data
	 * @param {function} callback
	 */
	listenCallback(callback) {
		this.callback = callback
	}

	/**
	 * Set the configuration for axios
	 * @param {object} config
	 */
	setConfig(config) {
		this.config = config
	}

	/**
	 * Run the service
	 */
	run() {
		if (this.running) return
		this.running = true
		// The services are always running on 1s delay by default
		this.routine = setInterval(() => {
			axios({
				url: this.url + this.query + this.appendUrlData,
				signal: !this.running,
				...this.config
			})
				.then((res) => {
					this.lastData = res.data
					this.callback(this.room, this.latestData())
				})
				.catch((_) => {
					this.callback(this.room, this.latestData())
				})
		}, this.ms)
	}

	/**
	 * Stop the service
	 */
	stop() {
		if (!this.running) return
		this.running = false
		this.query.length = 0
		clearInterval(this.routine)
	}
}

module.exports = Service
