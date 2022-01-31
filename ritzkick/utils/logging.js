const chalk = require('chalk')

const getTimeStamp = () => {
	return new Date().toISOString()
}

const info = (namespace, message, object = '') => {
	console.log(chalk.green(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object))
}

const warn = (namespace, message, object = '') => {
	console.log(chalk.yellow(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object))
}

const error = (namespace, message, object = '') => {
	console.log(chalk.red(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object))
}

const debug = (namespace, message, object = '') => {
	console.log(chalk.blue(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object))
}

module.exports = { info, warn, error, debug }
