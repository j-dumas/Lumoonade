const sendgrid = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Send an email to the user for reset password purposes.
 * @param {string} to
 */
const sendResetPasswordEmail = (to) => {
    sendgrid.send({
        to,
        from: process.env.SENDGRID_EMAIL_SENDER,
        subject: 'Reset Password',
        html: 
        `
            <h1>Cryptool Service</h1>
            <p>click this link ! <a href="x">reset</a></p>
        `
    })
}

/**
 * Send an email to the user for watchlist notification purposes.
 * @param {object} config 
 */
const sendWatchlistNotificationMessage = (config = { to, asked, price, assetName }) => {
    sendgrid.send({
        to: config.to,
        from: process.env.SENDGRID_EMAIL_SENDER,
        subject: 'Watchlist Notification!',
        html: 
        `
            <h1>Cryptool Service</h1>
            <p>This is a test! notification.</p>
            <p>You asked ${assetName} to be ${asked}. The price has reached the requirement!</p>
            <p>${assetName} is at ${asked}.</p>
        `
    })
}

module.exports = {
    sendResetPasswordEmail,
    sendWatchlistNotificationMessage
}