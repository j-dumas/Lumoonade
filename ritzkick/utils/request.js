const axios = require('axios').default

/**
 * Get the fastest api response from the list
 * @param {list} urls list of all urls
 * @param {controller} controller to set a signal for axios
 * @returns the fastest response
 */
const getFastestApiResponse = async (urls, controller) => {
	let calls = []
	urls.forEach((url) => {
		calls.push(makePromiseForApi(url, controller))
	})
	return await Promise.race(calls)
}

/**
 * Make a promise for the Promise.race
 * @param {string} url 
 * @param {controller} controller 
 */
const makePromiseForApi = (url, controller) => {
	return new Promise((res, rej) => {
		// Setup a signal to cancel itself when someone answered
		axios
			.get(url, {
				signal: controller.signal
			})
			.then((e) => {
				// This triggers to abort all active requests on the current controller.
				if (e.status !== 200) {
					return rej('Failed')
				}
				controller.abort()
				res({
					host: e.request.host,
					data: e.data
				})
			})
			.catch((err) => {
				rej(err)
			})
	})
}

module.exports = {
	getFastestApiResponse
}
