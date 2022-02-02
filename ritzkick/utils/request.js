const axios = require('axios').default

// -------------------------------------
// It returns the data of the first api that answers.
// -------------------------------------
const getFastestApiResponse = async (urls, controller) => {
    let calls = []
    urls.forEach(url => {
        calls.push(makePromiseForApi(url, controller))
    })
    return await Promise.race(calls)
}

// -------------------------------------
// Building an api call request (promise)
// -------------------------------------
const makePromiseForApi = (url, controller) => {
    return new Promise((res, rej) => {
        // Setup a signal to cancel itself when someone answered
        axios.get(url, {
            signal: controller.signal
        }).then(e => {
            // This triggers to abort all active requests on the current controller.
            if (e.status !== 200) {
                return rej('Failed')
            }
            controller.abort()
            res({
                host: e.request.host,
                data: e.data
            })
        }).catch(err => {
            rej(err)
        })
    })
}

module.exports = {
    getFastestApiResponse
}