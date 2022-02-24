import { getCookie } from './CookieService'
import { isUserConnected } from './AuthService'

export async function addFavorite(slug) {
	if (!isUserConnected()) return
	const URI = `/api/favorite`

	let response = await fetch(URI, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getCookie('token')
		},
		body: JSON.stringify({ slug: slug })
	})
}

export async function deleteFavorite(slug) {
	if (!isUserConnected()) return
	const URI = `/api/favorite`

	let response = await fetch(URI, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getCookie('token')
		},
		body: JSON.stringify({ slug: slug })
	})
}

export async function getFavorites() {
	if (!isUserConnected()) return []
	try {
		let response = await fetch('/api/me/favorites', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		let json = await response.json()
		return json.favorites
	} catch (e) {
		console.log(e)
	}
}

export async function getWatchList() {
	try {
		let response = await fetch('/api/me/watchlists', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		let json = await response.json()
		return json.watchlists
	} catch (e) {
		console.log(e)
	}
}

export async function deleteWatch(alertId) {
	try {
		let response = await fetch('/api/alerts/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			},
			body: JSON.stringify({ id: alertId })
		})

		let json = await response.json()
		console.log(json)
	} catch (e) {
		console.log(e)
	}
}

export async function addWatch(alert) {
	try {
		let response = await fetch('/api/alerts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			},
			body: JSON.stringify({ slug: alert.slug, target: alert.target, parameter: alert.parameter })
		})

		let json = await response.json()
		console.log(json)
	} catch (e) {
		console.log(e)
	}
}

export async function deleteUser() {
	try {
		let response = await fetch('/api/me/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		let json = await response.json()
		console.log(json)

		document.cookie = 'token=; expires=Thu, 1 Jan 1970 00:00:00 UTC, Secure, Http-Only, SameSite=Strict'
		window.location.assign('/')
	} catch (e) {
		console.log(e)
	}
}

export async function getUser() {
	try {
		let response = await fetch('/api/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		if (response.status === 401) {
			window.location.assign('/login')
		} else {
			let json = await response.json()
			return json
		}
	} catch (e) {
		console.log(e)
	}
}

export async function removeSession() {
	try {
		let response = await fetch('/api/me/sessions/purge', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		let json = await response.json()
		console.log(json)
	} catch (e) {
		console.log(e)
	}
}

export async function updateUser(event, oldUsername, newUsername, oldPass, newPass, newPassConfirmation) {
	if (oldUsername !== undefined) {
		if (newUsername !== oldUsername && newUsername !== undefined) {
			if (newPass !== undefined && newPassConfirmation !== undefined && oldPass !== undefined) {
				if (newPass === newPassConfirmation) {
					event.preventDefault()
					await updateUsernameAndPassword(newUsername, oldPass, newPass)
				} else {
					document.getElementById('wrong-name').style.display = 'block'
					event.preventDefault()
				}
			} else {
				event.preventDefault()
				await updateUsername(newUsername)
			}
		} else if (newPass !== undefined && newPassConfirmation !== undefined && oldPass !== undefined) {
			if (newPass === newPassConfirmation) {
				event.preventDefault()
				await updatePassword(oldPass, newPass)
			} else {
				document.getElementById('wrong-password').style.display = 'block'
				event.preventDefault()
			}
		} else if (newPass === undefined || newPassConfirmation === undefined || oldPass === undefined) {
			document.getElementById('wrong-password').style.display = 'block'
			event.preventDefault()
		}
	}

	async function updatePassword(oldPass, newPass) {
		try {
			const token = getCookie('token')
			const response = await fetch('/api/me/update', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				},
				body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
			})

			if (response.status === 200) {
				alert('Profil modifié avec succès')
				window.location.assign('/profile')
			} else if (response.status === 400) {
				document.getElementById('wrong-password').style.display = 'block'
			} else {
				alert('Something went wrong')
			}
		} catch (e) {
			console.log(e.message)
		}
	}

	async function updateUsername(newUsername) {
		try {
			const token = getCookie('token')
			const response = await fetch('/api/me/update', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				},
				body: JSON.stringify({ username: newUsername })
			})

			if (response.status === 200) {
				alert('Profil modifié avec succès')
				window.location.assign('/profile')
			} else if (response.status === 400) {
				document.getElementById('wrong-name').style.display = 'block'
			} else {
				alert('Something went wrong')
			}
		} catch (e) {
			console.log(e.message)
		}
	}

	async function updateUsernameAndPassword(newUsername, oldPass, newPass) {
		try {
			const token = getCookie('token')
			const response = await fetch('/api/me/update', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				},
				body: JSON.stringify({ username: newUsername, oldPassword: oldPass, newPassword: newPass })
			})

			if (response.status === 200) {
				alert('Profil modifié avec succès')
				window.location.assign('/profile')
			} else if (response.status === 400) {
				document.getElementById('wrong-name').style.display = 'block'
				document.getElementById('wrong-password').style.display = 'block'
			} else {
				alert('Something went wrong')
			}
		} catch (e) {
			console.log(e.message)
		}
	}
}
