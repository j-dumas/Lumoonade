import { getCookie, setCookie } from '../services/CookieService'

export function isUserConnected() {
	const token = getCookie('token')

	if (!token) return false
	if (token == undefined) return false
	return true
}

export async function logout() {
	try {
		const token = getCookie('token')
		await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		})

		//Delete cookie and redirect
		document.cookie = 'token=; expires=Thu, 1 Jan 1970 00:00:00 UTC, Secure, Http-Only, SameSite=Strict'
		window.location.assign('/')
	} catch (e) {
		console.log(e)
	}
}

export async function login(email, password) {
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
			window.location.assign('/')
		} else if (response.status == 400) {
			document.getElementById('wrong').style.display = 'block'
		} else {
			alert('Something went wrong')
		}
	} catch (e) {
		console.log(e.message)
	}
}

export async function register(email, username, password) {
	try {
		let response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email, username: username, password: password })
		})

		let json = await response.json()
		setCookie(json.token)
		window.location.assign('/')
	} catch (e) {
		console.log(e)
		alert(e.message)
	}
}
