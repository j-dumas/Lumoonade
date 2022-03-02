import {isUserConnected} from '../services/AuthService'

export async function getUserDashboardData() {
	return { assets: [
        {
            name: "eth",
            totalSpent: 1000,
            holding: 2,
            transactions: 1
        },
        {
            name: "btc",
            totalSpent: 3400,
            holding: .5,
            transactions: 1
        },
        {
            name: "ltc",
            totalSpent: 200,
            holding: 6,
            transactions: 1
        }
    ] }
	if (!isUserConnected()) return
	const URI = `/api/wallets/detailed`

	let response = await fetch(URI, {
		method: 'GET',
        headers: {'Content-Type': 'application/json'},
	})
    
    let json = response.json()
    return json
}