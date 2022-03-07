function getAllPaths() {
	var pathname = location.pathname.replace(/\/$/, ''),
		segments = pathname.split('/'),
		paths = []

	for (var i = 0, l = segments.length, path; i < l; i++) {
		path = segments.slice(0, i + 1).join('/')

		paths.push(path) // as file
		paths.push(path + '/') // as directory
	}

	return paths
}

//https://www.w3schools.com/js/js_cookies.asp
export function getCookie(cname) {
	let name = cname + '='
	let decodedCookie = decodeURIComponent(document.cookie)
	let ca = decodedCookie.split(';')
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) == ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length)
		}
	}
	return undefined
}

export function setCookie(value) {
	const name = 'token'
	const exdays = 0.1 // Will make expiration approximatly 7 hours

	const d = new Date()
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
	let expires = 'expires=' + d.toUTCString()
	document.cookie =
		name + '=' + value + ';' + expires + '; Http-Only, SameSite=Strict, path=/;'
}

export function deleteCookie(cname) {
	document.cookie =
		cname + '=; expires=Thu, 1 Jan 1970 00:00:00 UTC; Http-Only, SameSite=Strict, path=/;'
}
