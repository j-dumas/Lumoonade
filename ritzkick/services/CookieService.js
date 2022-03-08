import cookieCutter from 'cookie-cutter'

export function getCookie(cname) {
	return cookieCutter.get(cname)
}

export function setCookie(value) {
	const name = 'token'
	const exdays = 0.2

	const d = new Date()
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
<<<<<<< HEAD

	cookieCutter.set(name, value)
}

export function deleteCookie(cname) {
	cookieCutter.set(cname, '', { expires: new Date(0) })
=======
	let expires = 'expires=' + d.toUTCString()
	document.cookie = name + '=' + value + ';' + expires + '; Http-Only, SameSite=Strict, path=/;'
}

export function deleteCookie(cname) {
	document.cookie = cname + '=; expires=Thu, 1 Jan 1970 00:00:00 UTC; Http-Only, SameSite=Strict, path=/;'
>>>>>>> develop
}
