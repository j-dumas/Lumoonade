const axios = require('axios').default;
const chalk = require('chalk');
const cm = require('./connection-manager');

// variables that may change
let routine = undefined;
let interval = 1000 * 5;
let params = '';
let running = false;

/**
 * Set a new delay for all requests
 * @param {Number} ms time in millis.
 */
const setFetchInterval = (ms) => {
	interval = ms;
};

/**
 * Refresh the query with the active channels.
 */
const updateFetch = () => {
	params = cm.getAllListeningChannels();
};

/**
 * Run the service to start fetching data from the api.
 * @param {String} reason log a reason in the console (if you have access to it).
 * @param {callback} cb callback with the response when the request is fetched.
 */
const run = (reason = 'Running Thread', cb) => {
	if (running) return;
	running = true;
	console.log(chalk.greenBright('[Server]: ').concat(chalk.whiteBright(reason)));
	routine = setInterval(async () => {
		let res = (await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?&symbols=${params}`)).data
			.quoteResponse.result;
		console.log(
			chalk.greenBright('[Server]: ').concat(chalk.whiteBright('Fetch data for ' + cm.getAllListeningChannels()))
		);
		cb(res);
	}, interval);
};

/**
 * Stop the service from fetching data.
 * @param {String} reason log a reason in the console (if you have access to it).
 */
const stop = (reason = 'Stopping Thread') => {
	if (!running) return;
	running = false;
	console.log(chalk.greenBright('[Server]: ').concat(chalk.whiteBright(reason)));
	clearInterval(routine);
};

module.exports = {
	setFetchInterval,
	updateFetch,
	run,
	stop
};
