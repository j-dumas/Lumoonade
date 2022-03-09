import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { isUserConnected } from 'services/AuthService'
import Link from 'next/link'

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
					<Link href="https://konjuu.com" target="_blank" rel="noreferrer">
						{t('footer.powered') + DEV_TEAM_NAME}
					</Link>
					<p>
						{WEBSITE_NAME} © {year}
					</p>
					<Image src={'/themoon-t.png'} width={125} height={125} alt={t('footer.image-alt')} layout="fixed" />
				</div>
				<div className="column start footer-div">
					<p className="footer-title">{t('footer.navigation.title')}</p>
					<Link href="">{t('footer.navigation.home')}</Link>
					<Link href="">{t('footer.navigation.assets')}</Link>
					<Link href="">{t('footer.navigation.compare')}</Link>
				</div>
				<div className="column start footer-div">
					<p className="footer-title">{t('footer.account.title')}</p>
					{userConnected ? (
						<>
							<Link href="/me/dashboard">{t('footer.account.dashboard')}</Link>
							<Link href="/me/portfolio">{t('footer.account.portfolio')}</Link>
							<Link href="/profile">{t('footer.account.profile')}</Link>
							<Link href="/profile">{t('footer.account.favorites')}</Link>
							<Link href="/profile">{t('footer.account.alerts')}</Link>
						</>
					) : (
						<>
							<Link href="/login">{t('footer.account.login')}</Link>
							<Link href="/register">{t('footer.account.register')}</Link>
						</>
					)}
				</div>
				<div className="column start footer-div">
					<p className="footer-title">{t('footer.about.title')}</p>
					<Link href="/about">{t('footer.about.us')}</Link>
					<Link href="/tos">{t('footer.about.tos')}</Link>
					<Link href="/career">{t('footer.about.career')}</Link>
				</div>
			</div>
		</footer>
	)
}

export default Footer
