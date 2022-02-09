import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import RegisterForm from '../components/RegisterForm'
import Bubbles from '../components/Bubbles'
import { useEffect } from 'react'
import { getCookie } from '../services/CookieService'

export default function Register() {

	useEffect(() => {
		const token = getCookie("token")
		if(token !== undefined){
			window.location.href = '/'
		}
	}, [])

	return (
		<div>
			<DomHead />
			<main>
				<RegisterForm />
				<Bubbles />
				<div className='spacer layer1'></div>
			</main>
			<Footer />
			<div className='cursor'></div>
		</div>
	)
}
