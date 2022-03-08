import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { isUserConnected } from 'services/AuthService'

const DEV_TEAM_NAME = 'RitzKick'
const WEBSITE_NAME = 'Lumoonade'

function Footer() {
	const { t } = useTranslation('common')
	const year =  new Date().getFullYear();
	const [userConnected, setUserConnected] = useState(false)

	useEffect(() => {
		setUserConnected(isUserConnected())
	}, [])

	return (
		<footer className='footer section'>
			<div className='sub-section row'>
				<div className='column start footer-div'>
					<p className='footer-title'>{WEBSITE_NAME}</p>
					<a href="https://konjuu.com" target="_blank" rel="noreferrer">
					{t('footer.powered') + DEV_TEAM_NAME}
					</a>
					<p>{WEBSITE_NAME} © {year}</p>
					<Image src={'/themoon-t.png'} width={125} height={125} alt={t('footer.image-alt')} layout="fixed"/>
				</div>
				<div className='column start footer-div'>
					<p className='footer-title'>Navigation</p>
					<a href="">Home</a>
					<a href="">Cryptos</a>
					<a href="">Compare</a>
				</div>
				<div className='column start footer-div'>
					<p className='footer-title'>Account</p>
					{userConnected ?
					<>
						<a href="/me/dashboard">Dashboard</a>
						<a href="/me/portfolio">Portfolio</a>
						<a href="/me/profile">Profile</a>
						<a href="/me/profile">Favorites</a>
						<a href="/me/profile">Alerts</a>
					</>
					:
					<>
						<a href="/login">Login</a>
						<a href="/register">Register</a>
					</>
					}
				</div>
				<div className='column start footer-div'>
					<p className='footer-title'>About</p>
					<a href="/about">About us</a>
					<a href="/tos">Terms of services</a>
					<a href="/career">Career</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer
