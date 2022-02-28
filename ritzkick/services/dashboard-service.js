import {isUserConnected} from '../services/AuthService'

export async function getUserDashboardData() {
	if (!isUserConnected()) return
	const URI = `/api/wallets/detailed`

	let response = await fetch(URI, {
		method: 'GET',
        headers: {'Content-Type': 'application/json'},
	})
    
    let json = response.json()
    return json
}