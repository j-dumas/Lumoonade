import { isUserConnected } from '../services/AuthService'
import {getCookie} from '../services/CookieService'

export async function getUserDashboardData() {
	/*return { assets: [
        {
            name: "eth",
            totalSpent: 1000,
            amount: 2,
            transactions: 1
        },
        {
            name: "btc",
            totalSpent: 3400,
            amount: .5,
            transactions: 1
        },
        {
            name: "ltc",
            totalSpent: 200,
            amount: 6,
            transactions: 1
        }
    ] }*/

	if (!isUserConnected()) return
	const URI = `/api/wallets/detailed`

	let response = await fetch(URI, {
		method: 'GET',
		headers: { 
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + getCookie('token')
        }
	})

	let json = await response.json()
    console.log(json)
	return json
}
