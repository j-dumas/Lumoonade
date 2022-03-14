import React from 'react'
import { useRouter } from 'next/router'
import { getCookie, setCookie, deleteCookie } from './CookieService'

const paths = require('../api/routes.json')

export function isUserConnected() {
	const token = getCookie('token')

	if (!token) return false
	if (token == undefined) return false
	return true
}

export async function logout(setConnection) {
	try {
		const token = getCookie('token')
		const response = await fetch(paths.auth.logout, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		})

		if (response.status === 200) {
			deleteCookie('token')
			setConnection(false)
		}
	} catch (_) {}
}

export async function login(email, password, handleError) {
	try {
		let response = await fetch(paths.auth.login, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email, password: password })
		})

		if (response.status == 200) {
			let json = await response.json()
			setCookie(json.token)
			return response.status
		} else if (response.status === 400 || response.status === 404) {
			handleError()
		} else if (response.status === 409) {
			alert('Please validate your email')
		} else {
			alert('Something went wrong')
		}
	} catch (_) {}
}

export async function googleLogin(idToken) {
	try {
		let response = await fetch(paths.auth.google, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ idToken: idToken })
		})

		if (response.status == 200) {
			let json = await response.json()
			setCookie(json.token)
			return response.status
		} else if (response.status == 400) {
			handleError()
		} else {
			alert('Something went wrong')
		}
	} catch (_) {}
}

export async function register(email, username, password, handleError) {
	try {
		let response = await fetch(paths.auth.register, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email, username: username, password: password })
		})

		if (response.status === 201) {
			const response = await fetch(paths.confirmation.default, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email })
			})

			return response.status
		} else {
			handleError()
		}
	} catch (e) {
		alert(e.message)
	}
}

export async function confirmEmail(key) {
	try {
		const response = await fetch(paths.confirmation.verify + key, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} catch (e) {}
}

export async function resetPassword(key, password, passwordConfirmation) {
	try {
		let response = await fetch(paths.reset.redeem, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				resetToken: key,
				password: password,
				confirmation: passwordConfirmation
			})
		})

		return response.status
	} catch (e) {}
}

export async function sendForgotPassword(email) {
	try {
		let response = await fetch(paths.reset.default, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email })
		})

		return response.status
	} catch (e) {}
}
