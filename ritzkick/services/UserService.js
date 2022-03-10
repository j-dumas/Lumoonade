import { getCookie, deleteCookie } from './CookieService'
import { isUserConnected } from './AuthService'

const paths = require('../api/routes.json')

export async function addTransaction(asset, boughtAt, paid, when) {
	if (!isUserConnected()) return
	const URI = `${paths.wallets['transaction-default']}${asset}`
	let response = await fetch(URI, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getCookie('token')
		},
		body: JSON.stringify({
			boughtAt: boughtAt,
			paid: paid,
			when: when
		})
	})
	if (response.status != 201 && paid > 0) {
		let res = await createWallet(asset)
		if (res.status === 201) addTransaction(asset, boughtAt, paid, when)
	}
}

export async function createWallet(asset) {
	if (!isUserConnected()) return
	const URI = paths.wallets.default

	let response = await fetch(URI, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getCookie('token')
		},
		body: JSON.stringify({
			asset: asset,
			amount: 0
		})
	})

	return response
}

export async function getTransactions() {
	if (!isUserConnected()) return
	const URI = paths.wallets.transactions

	let response = await fetch(URI, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getCookie('token')
		}
	})

	let json = await response.json()
	return json
}

export async function addFavorite(slug) {
	if (!isUserConnected()) return
	const URI = paths.favorites.default

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
	const URI = paths.favorites.default

	let response = await fetch(URI, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getCookie('token')
		},
		body: JSON.stringify({ slug: slug })
	})
}

export async function getFavorites(limit = 1000, page = 1) {
	if (!isUserConnected()) return []
	try {
		let response = await fetch(paths.favorites.all + '?limit=' + limit + '&page=' + page, {
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

export async function getFavoritesMaxPage(limit = 5) {
	if (!isUserConnected()) return []
	try {
		let response = await fetch(paths.favorites.all + '?limit=' + limit, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		let json = await response.json()
		return json.max_page
	} catch (e) {
		console.log(e)
	}
}

export async function getWatchList(page = 1) {
	try {
		let response = await fetch(`${paths.alerts.all}?page=${page}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		let json = await response.json()
		return json
	} catch (e) {
		console.log(e)
	}
}

export async function deleteWatch(alertId) {
	try {
		await fetch(paths.alerts.default, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			},
			body: JSON.stringify({ id: alertId })
		})
	} catch (e) {
		console.log(e)
	}
}

export async function addWatch(slug, parameter, target) {
	try {
		await fetch(paths.alerts.default, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			},
			body: JSON.stringify({ slug: slug, target: target, parameter: parameter })
		})
	} catch (e) {
		console.log(e)
	}
}

export async function deleteUser() {
	try {
		await fetch(paths.user.default, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		deleteCookie('token')
	} catch (e) {
		console.log(e)
	}
}

export async function getUser() {
	try {
		let response = await fetch(paths.user.default, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		if (response.status === 401) {
			deleteCookie('token')
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
		let response = await fetch(paths.user['purge-sessions'], {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getCookie('token')
			}
		})

		let json = await response.json()
		return json.purged
	} catch (e) {
		console.log(e)
	}
}

export async function updateUser(event, oldUsername, newUsername, oldPass, newPass, newPassConfirmation, setError) {
	event.preventDefault()
	if (oldUsername !== undefined) {
		if (newUsername !== oldUsername && newUsername !== undefined) {
			if (newPass !== undefined && newPassConfirmation !== undefined && oldPass !== undefined) {
				if (newPass === newPassConfirmation) {
					await updateUsernameAndPassword(newUsername, oldPass, newPass)
				}
			} else {
				await updateUsername(newUsername)
			}
		} else if (newPass !== undefined && newPassConfirmation !== undefined && oldPass !== undefined) {
			if (newPass === newPassConfirmation) {
				await updatePassword(oldPass, newPass)
			} else {
				setError(true)
			}
		} else if (newPass === undefined || newPassConfirmation === undefined || oldPass === undefined) {
			setError(true)
		}
	}

	async function updatePassword(oldPass, newPass) {
		try {
			const token = getCookie('token')
			const response = await fetch(paths.user.default, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				},
				body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
			})

			if (response.status === 400) {
				document.getElementById('wrong-password').style.display = 'block'
			} else if (response.status === 500) {
				alert('Something went wrong')
			}
		} catch (e) {
			console.log(e.message)
		}
	}

	async function updateUsername(newUsername) {
		try {
			const token = getCookie('token')
			const response = await fetch(paths.user.default, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				},
				body: JSON.stringify({ username: newUsername })
			})

			if (response.status === 400) {
				document.getElementById('wrong-name').style.display = 'block'
			} else if (response.status === 500) {
				alert('Something went wrong')
			}
		} catch (e) {
			console.log(e.message)
		}
	}

	async function updateUsernameAndPassword(newUsername, oldPass, newPass) {
		try {
			const token = getCookie('token')
			const response = await fetch(paths.user.default, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				},
				body: JSON.stringify({ username: newUsername, oldPassword: oldPass, newPassword: newPass })
			})

			if (response.status === 400) {
				document.getElementById('wrong-name').style.display = 'block'
				document.getElementById('wrong-password').style.display = 'block'
			} else if (response.status === 500) {
				alert('Something went wrong')
			}
		} catch (e) {
			console.log(e.message)
		}
	}
}
