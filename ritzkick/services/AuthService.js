import { getCookie, setCookie } from '../services/CookieService'

export async function logout() {
<<<<<<< HEAD
    try {
        const token = getCookie("token")
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        
        //Delete cookie and redirect
        document.cookie = "token=; expires=Thu, 1 Jan 1970 00:00:00 UTC, Http-Only, SameSite=Strict" 
        window.location.assign('/')
    }
    catch(e){
        console.log(e)
    }
=======
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
>>>>>>> b1c502097d599a8835ca563628c863e509925cd0
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

<<<<<<< HEAD
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
=======
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
>>>>>>> b1c502097d599a8835ca563628c863e509925cd0
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

<<<<<<< HEAD
        let json = await response.json()
        setCookie(json.token)
        window.location.assign('/profile')
    }
    catch(e){
        console.log(e)
        alert(e.message)
    }
=======
		let json = await response.json()
		setCookie(json.token)
		window.location.assign('/')
	} catch (e) {
		console.log(e)
		alert(e.message)
	}
>>>>>>> b1c502097d599a8835ca563628c863e509925cd0
}
