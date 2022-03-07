const axios = require('axios').default
const validator = require('validator').default

/**
 * Checks if the email is legitimate (belongs to a website)
 * @param {string} email Email
 * @returns boolean
 */
const isLegitimateEmail = async (email) => {
	if (!validator.isEmail(email)) return false
	try {
		let domain = email.split('@')[1]
		const response = await axios.get(`https://www.${domain}/`)
		return !response.isAxiosError
	} catch (_) {
		return false
	}
}

module.exports = {
	isLegitimateEmail
}
