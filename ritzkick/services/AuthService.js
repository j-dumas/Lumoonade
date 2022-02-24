import { getCookie, setCookie, deleteCookie } from '../services/CookieService'

export async function logout() {
    try {
        const token = getCookie("token")
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        
        deleteCookie("token")
        window.location.assign('/')
    }
    catch(e){
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

        if(response.status == 200){
            let json = await response.json()
            setCookie(json.token)
            window.location.assign('/profile')
        }
        else if (response.status == 400){
            document.getElementById("wrong").style.display = "block"
        }
        else {
            alert("Something went wrong")
        }
    }
    catch(e){
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
        
        window.location.assign('/profile')
    }
    catch(e){
        console.log(e)
        alert(e.message)
    }
}
