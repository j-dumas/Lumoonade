const sendgrid = require('@sendgrid/mail')
const logger = require('../../utils/logging')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Send an email to the user for reset password purposes.
 * @param {string} to
 */
const sendResetPasswordEmail = (to, link) => {
	sendgrid
		.send({
			to,
			from: process.env.SENDGRID_EMAIL_SENDER,
			subject: 'Reset Password',
			html: `
            <h1>Cryptool Service</h1>
            <p>click this link ! <a href="${link}">reset</a></p>
        `
		})
		.then((res) => {
			logger.info('Email', `Email sent to ${to}!`)
		})
}

/**
 * Send an email to the user for watchlist notification purposes.
 * @param {object} config
 */
const sendWatchlistNotificationMessage = (config = { to, asked, price, assetName }) => {
	sendgrid
		.send({
			to: config.to,
			from: process.env.SENDGRID_EMAIL_SENDER,
			subject: 'Watchlist Notification!',
			html: `
            <h1>Cryptool Service</h1>
            <p>This is a test! notification.</p>
            <p>You asked ${config.assetName} to be ${config.asked}. The price has reached the requirement!</p>
            <p>${config.assetName} is at ${config.asked}.</p>
        `
		})
		.then((res) => {
			logger.info('Email', `Email sent to ${config.to}!`)
		})
}

module.exports = {
	sendResetPasswordEmail,
	sendWatchlistNotificationMessage
}