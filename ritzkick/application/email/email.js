const sendgrid = require('@sendgrid/mail')
const logger = require('../../utils/logging')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Send an email to the user for reset password purposes.
 * @param {string} to
 */
const sendResetPasswordEmail = (to) => {
    logger.info('Email', 'email sent to ' + to + ' for password reset')
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
    logger.info('Email', 'email sent to ' + config.to + ' for watchlist notification')
    console.log(config)
    // sendgrid.send({
    //     to: config.to,
    //     from: process.env.SENDGRID_EMAIL_SENDER,
    //     subject: 'Watchlist Notification!',
    //     html: 
    //     `
    //         <h1>Cryptool Service</h1>
    //         <p>This is a test! notification.</p>
    //         <p>You asked ${config.assetName} to be ${config.asked}. The price has reached the requirement!</p>
    //         <p>${config.assetName} is at ${config.asked}.</p>
    //     `
    // })
}

module.exports = {
    sendResetPasswordEmail,
    sendWatchlistNotificationMessage
}