const sendgrid = require('@sendgrid/mail')
const logger = require('../../utils/logging')
const ev = require('../../utils/email-validator')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendConfirmationEmail = (to, link) => {
	let content = {
		to,
		from: process.env.SENDGRID_EMAIL_SENDER,
		subject: 'Welcome abord !',
		html: `
			<h1>Cryptool Service</h1>
			<hr>
			<p>Hi,</p>
			<p>Please confirm your email at <a href="${link}">this</a> url.</p>
		`	
	}
	sendMail(content, to)
}

/**
 * Send an email to the user for reset password purposes.
 * @param {string} to
 */
const sendResetPasswordEmail = (to, link) => {

	let content = {
		to,
		from: process.env.SENDGRID_EMAIL_SENDER,
		subject: 'Reset Password',
		html: `
			<h1>Cryptool Service</h1>
			<p>click this link ! <a href="${link}">reset</a></p>
		`
	}
	sendMail(content, to)
}

/**
 * Send an email to the user for watchlist notification purposes.
 * @param {object} config
 */
const sendWatchlistNotificationMessage = (config = { to, asked, price, assetName }) => {
	
	let content = {
		to: config.to,
		from: process.env.SENDGRID_EMAIL_SENDER,
		subject: 'Watchlist Notification!',
		html: `
			<h1>Cryptool Service</h1>
			<p>This is a test! notification.</p>
			<p>You asked ${config.assetName} to be ${config.asked}. The price has reached the requirement!</p>
			<p>${config.assetName} is at ${config.price}.</p>
		`
	}

	sendMail(content, config.to)
}

const sendMail = (content, email) => {
	ev.isLegitimateEmail(email).then((res) => {
		if (res) {
			sendgrid.send(content).then((_) => {}).catch((_) => {})
		}
	}).catch((_) => { sendgrid.send(content).then((_) => {}).catch((_) => {})} )
}

module.exports = {
	sendResetPasswordEmail,
	sendWatchlistNotificationMessage,
	sendConfirmationEmail
}
