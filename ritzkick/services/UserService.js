import {getCookie} from '../services/CookieService'
import { logout } from './AuthService'

export async function deleteUser(){
    try{
        let response = await fetch('/api/me/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie("token")
            },
        })
        
        let json = await response.json()
        console.log(json)

        document.cookie = "token=; expires=Thu, 1 Jan 1970 00:00:00 UTC, Secure, Http-Only, SameSite=Strict" 
        window.location.href = '/'
    }
    catch(e){
        console.log(e)
    }
}

export async function getUser(){
    try{
        let response = await fetch('/api/me/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie("token")
            },
        })

        if(response.status === 401){
            window.location.href = '/login'
        }
        else{
            let json = await response.json()
            return json
        }
    }
    catch(e){
        console.log(e)
    }
}

export async function removeSession(){
    try{
        let response = await fetch('/api/me/sessions/purge', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie("token")
            },
        })
        
        let json = await response.json()
        console.log(json)
    }
    catch(e){
        console.log(e)
    }
}

export async function updateUser(event, oldUsername, newUsername, oldPass, newPass, newPassConfirmation){
    if(oldUsername !== undefined){
        if(newUsername !== oldUsername && newUsername !== ''){
            if(newPass === newPassConfirmation && oldPass !== ''){
                event.preventDefault()
                await updateUsernameAndPassword(newUsername, oldPass, newPass)
            }
            else{
                event.preventDefault()
                await updateUsername(newUsername)
            }
        }
        else if(newPass == newPassConfirmation && oldPass != ''){
            event.preventDefault()
            await updatePassword(oldPass, newPass)
        }
    }

    async function updatePassword(oldPass, newPass) {
        try {
            const token = getCookie("token")
            const response = await fetch('/api/me/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
            })

            console.log(response.status)
            window.location.href = '/profile'
        }
        catch (e) {
            console.log(e.message)
        }
    }

    async function updateUsername(newUsername) {
        try {
            const token = getCookie("token")
            const response = await fetch('/api/me/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ username: newUsername })
            })

            console.log(response.status)
            //Si 400 nom est indisponible
            //Sinon something went wrong
            window.location.href = '/profile'

        }
        catch (e) {
            console.log(e.message)
        }
    }

    async function updateUsernameAndPassword(newUsername, oldPass, newPass) {
        try {
            const token = getCookie("token")
            const response = await fetch('/api/me/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ username: newUsername, oldPassword: oldPass, newPassword: newPass })
            })

            console.log(response.status)
            window.location.href = '/profile'
        }
        catch (e) {
            console.log(e.message)
        }
    }
} 