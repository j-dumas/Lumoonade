import { getCookie, setCookie, deleteCookie } from './CookieService'

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

		deleteCookie('token')
		window.location.assign('/')
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
			window.location.assign('/profile')
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

		console.log(response.status)

		if (response.status === 201) {
			//let json = await response.json()
			//setCookie(json.token)

			//Confirmation
			await fetch('/api/confirmations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email })
			})
				.catch((e) => console.log(e))
				.finally(() => {
					window.location.assign('/login')
				})
		} else {
			handleError()
		}
	} catch (e) {
		console.log(e)
		alert(e.message)
	}
}
