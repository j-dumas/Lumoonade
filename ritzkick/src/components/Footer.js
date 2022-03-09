import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { isUserConnected } from 'services/AuthService'

const DEV_TEAM_NAME = 'RitzKick'
const WEBSITE_NAME = 'Lumoonade'

function Footer() {
	const { t } = useTranslation('common')
	const year = new Date().getFullYear()
	const [userConnected, setUserConnected] = useState(false)

	useEffect(() => {
		setUserConnected(isUserConnected())
	}, [])

	return (
		<footer className="footer section">
			<div className="sub-section row">
				<div className="column start footer-div">
					<p className="footer-title">{WEBSITE_NAME}</p>
					<a href="https://konjuu.com" target="_blank" rel="noreferrer">
						{t('footer.powered') + DEV_TEAM_NAME}
					</a>
					<p>
						{WEBSITE_NAME} © {year}
					</p>
					<Image src={'/themoon-t.png'} width={125} height={125} alt={t('footer.image-alt')} layout="fixed" />
				</div>
				<div className="column start footer-div">
					<p className="footer-title">{t('footer.navigation.title')}</p>
					<a href="">{t('footer.navigation.home')}</a>
					<a href="">{t('footer.navigation.assets')}</a>
					<a href="">{t('footer.navigation.compare')}</a>
				</div>
				<div className="column start footer-div">
					<p className="footer-title">{t('footer.account.title')}</p>
					{userConnected ? (
						<>
							<a href="/me/dashboard">{t('footer.account.dashboard')}</a>
							<a href="/me/portfolio">{t('footer.account.portfolio')}</a>
							<a href="/me/profile">{t('footer.account.profile')}</a>
							<a href="/me/profile">{t('footer.account.favorites')}</a>
							<a href="/me/profile">{t('footer.account.alerts')}</a>
						</>
					) : (
						<>
							<a href="/login">{t('footer.account.login')}</a>
							<a href="/register">{t('footer.account.register')}</a>
						</>
					)}
				</div>
				<div className="column start footer-div">
					<p className="footer-title">{t('footer.about.title')}</p>
					<a href="/about">{t('footer.about.us')}</a>
					<a href="/tos">{t('footer.about.tos')}</a>
					<a href="/career">{t('footer.about.career')}</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer
