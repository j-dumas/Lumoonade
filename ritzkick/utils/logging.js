const chalk = require('chalk');
const moment = require('moment');

/**
 * @returns Current Date as ISOString
 */
const getTimeStamp = () => {
	return moment.unix(moment.now() / 1000).format('YYYY-MM-DD hh:mm:ss A');
};

/**
 * Logs information in green in the console
 * following the pattern [TIMESTAMP] [TYPE] [NAMESPACE] message, object
 *
 * @param {String} namespace Part of the application from which the message is sent (SERVER, APP, API)
 * @param {String} message Message to be logged
 * @param {any} object Object to log if needed, defaults to ''
 */
const info = (namespace, message, object = '') => {
	console.log(chalk.green(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object));
};

/**
 * Logs warnings in yellow in the console
 * following the pattern [TIMESTAMP] [TYPE] [NAMESPACE] message, object
 *
 * @param {String} namespace Part of the application from which the message is sent (SERVER, APP, API)
 * @param {String} message Message to be logged
 * @param {any} object Object to log if needed, defaults to ''
 */
const warn = (namespace, message, object = '') => {
	console.log(chalk.yellow(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object));
};

/**
 * Logs errors in red in the console
 * following the pattern [TIMESTAMP] [TYPE] [NAMESPACE] message, object
 *
 * @param {String} namespace Part of the application from which the message is sent (SERVER, APP, API)
 * @param {String} message Message to be logged
 * @param {any} object Object to log if needed, defaults to ''
 */
const error = (namespace, message, object = '') => {
	console.log(chalk.red(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object));
};

/**
 * Logs debug information in blue in the console
 * following the pattern [TIMESTAMP] [TYPE] [NAMESPACE] message, object
 *
 * @param {String} namespace Part of the application from which the message is sent (SERVER, APP, API)
 * @param {String} message Message to be logged
 * @param {any} object Object to log if needed, defaults to ''
 */
const debug = (namespace, message, object = '') => {
	console.log(chalk.blue(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object));
};

module.exports = { info, warn, error, debug };
