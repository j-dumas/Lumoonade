import React from 'react'
import { useRouter } from 'next/router'
import { getCookie, setCookie, deleteCookie } from './CookieService'

export function isUserConnected() {
	const token = getCookie('token')

	if (!token) return false
	if (token == undefined) return false
	return true
}

export async function logout(setConnection) {
	try {
		const token = getCookie('token')
		const response = await fetch('/api/auth/logout', {
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
	} catch (e) {
		console.log(e)
	}
}

export async function login(email, password, handleError) {
	try {
		let response = await fetch('/api/auth/login', {
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
		} else {
			alert('Something went wrong')
		}
	} catch (e) {
		console.log(e.message)
	}
}

export async function googleLogin(idToken) {
	try {
		let response = await fetch('/api/auth/login', {
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
	} catch (e) {
		console.log(e.message)
	}
}

export async function register(email, username, password, handleError) {
	try {
		let response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email, username: username, password: password })
		})

		if (response.status === 201) {
			await fetch('/api/confirmations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email })
			}).catch((e) => console.log(e))
		} else {
			handleError()
		}
	} catch (e) {
		console.log(e)
		alert(e.message)
	}
}

export async function confirmEmail(key) {
	try {
		const response = await fetch('/api/confirmation/verify/' + key, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} catch (e) {}
}
