const sendgrid = require('@sendgrid/mail')
const logger = require('../../utils/logging')
const ev = require('../../utils/email-validator')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendConfirmationEmail = (to, link) => {
	ev.isLegitimateEmail(to).then((res) => {
		if (res) {
			sendgrid
			.send({
				to,
				from: process.env.SENDGRID_EMAIL_SENDER,
				subject: 'Welcome abord !',
				html: `
					<h1>Cryptool Service</h1>
					<hr>
					<p>Hi,</p>
					<p>Please confirm your email at <a href="${link}">this</a> url.</p>
				`
			})
			.then((_) => {
				logger.info('Email', `Email sent to ${to}!`)
			})
			.catch((_) => {})
		}
	}).catch((_) => {})
}

/**
 * Send an email to the user for reset password purposes.
 * @param {string} to
 */
const sendResetPasswordEmail = (to, link) => {
	ev.isLegitimateEmail(to).then((res) => {
		if (res) {
			sendgrid.send({
				to,
				from: process.env.SENDGRID_EMAIL_SENDER,
				subject: 'Reset Password',
				html: `
					<h1>Cryptool Service</h1>
					<p>click this link ! <a href="${link}">reset</a></p>
				`
			})
			.then((_) => {
				logger.info('Email', `Email sent to ${to}!`)
			})
			.catch((_) => {})
		}
	}).catch((_) => {})
}

/**
 * Send an email to the user for watchlist notification purposes.
 * @param {object} config
 */
const sendWatchlistNotificationMessage = (config = { to, asked, price, assetName }) => {
	ev.isLegitimateEmail(config.to).then((res) => {
		if (res) {
			sendgrid
			.send({
				to: config.to,
				from: process.env.SENDGRID_EMAIL_SENDER,
				subject: 'Watchlist Notification!',
				html: `
				<h1>Cryptool Service</h1>
				<p>This is a test! notification.</p>
				<p>You asked ${config.assetName} to be ${config.asked}. The price has reached the requirement!</p>
				<p>${config.assetName} is at ${config.price}.</p>
			`
			})
			.then((_) => {
				logger.info('Email', `Email sent to ${config.to}!`)
			})
			.catch((_) => {})
		}
	}).catch((_) => {})
}

module.exports = {
	sendResetPasswordEmail,
	sendWatchlistNotificationMessage,
	sendConfirmationEmail
}
