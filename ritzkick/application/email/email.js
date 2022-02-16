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
        subject: ''
    })
}