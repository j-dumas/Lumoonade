import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import LoginForm from '../components/LoginForm'
import Bubbles from '../components/Bubbles'
import { useEffect } from 'react'
import { getCookie } from '../services/CookieService'

export default function Login() {
	useEffect(() => {
		const token = getCookie('token')
		if (token !== undefined) {
			window.location.href = '/'
		}
	}, [])

	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'CRYPTOOL | LOGIN',
					description: 'Cryptool login page'
				}}
			/>
			<main>
				<LoginForm />
				<Bubbles />
				<div className="spacer layer1"></div>
			</main>
			<Footer />
			<div className="cursor"></div>
		</div>
	)
}
