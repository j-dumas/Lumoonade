import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Icons from './Icons'
import { logout } from '../services/AuthService'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

function Navbar(props) {
	const { t } = useTranslation('common')
	const router = useRouter()

	const [click, setClick] = useState(false)
	const handleClick = () => setClick(!click)
	const closeMobileMenu = () => setClick(false)

	async function logoutUser(event) {
		event.preventDefault()
		await logout()
	}

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 10)
		// clean up code
		window.removeEventListener('scroll', onScroll)
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<>
			<nav className="navbar" id="nav">
				{props.mobile ? (
					<>
						<div className="lil-nav">
							<div className="menu-icon" onClick={handleClick}>
								{click ? <Icons.Times /> : <Icons.Bars />}
							</div>
						</div>
					</>
				) : (
					<></>
				)}
				<div
					className={
						props.mobile ? (click ? 'active navbar-container-mobile' : 'hidden') : 'navbar-container'
					}
				>
					<ul className={props.mobile ? 'nav-menu-mobile' : 'nav-menu'}>
						<li className={router.pathname == '/' ? 'nav-item active-link' : 'nav-item'}>
							<Icons.Home />
							<Link href="/">
								<a className="nav-links" onClick={closeMobileMenu}>
									{t('navbar.home')}
								</a>
							</Link>
						</li>
						<li className={router.pathname == '/assets' ? 'nav-item active-link' : 'nav-item'}>
							<Icons.Coins />
							<Link href="/assets">
								<a className="nav-links" onClick={closeMobileMenu}>
									{t('navbar.assets')}
								</a>
							</Link>
						</li>
						<li className={router.pathname == '/podium' ? 'nav-item active-link' : 'nav-item'}>
							<Icons.ChartLine />
							<Link href="/compare">
								<a className="nav-links" onClick={closeMobileMenu}>
									{t('navbar.compare')}
								</a>
							</Link>
						</li>
					</ul>
					<ul className={props.mobile ? 'nav-menu-mobile' : 'nav-menu'}>
						{props.connected ? (
							<>
								<li className={router.pathname == '/wallet' ? 'nav-item active-link' : 'nav-item'}>
									<Icons.Wallet />
									<Link href="/wallet">
										<a className="nav-links" onClick={closeMobileMenu}>
											{t('navbar.user.wallet')}
										</a>
									</Link>
								</li>
								<li className={router.pathname == '/profile' ? 'nav-item active-link' : 'nav-item'}>
									<Icons.UserCircle />
									<Link href="/profile">
										<a className="nav-links" onClick={closeMobileMenu}>
											{t('navbar.user.profile')}
										</a>
									</Link>
								</li>
								<li className={router.pathname == '/logout' ? 'nav-item active-link' : 'nav-item'}>
									<Icons.DoorOpen />
									{
										<a className="nav-links" onClick={logoutUser}>
											{t('navbar.logout')}
										</a>
									}
								</li>
							</>
						) : (
							<>
								<li className={router.pathname == '/login' ? 'nav-item active-link' : 'nav-item'}>
									<div className="nav-icons">
										<Icons.DoorClosed />
									</div>
									<Link href="/login">
										<a className="nav-links" onClick={closeMobileMenu}>
											{t('navbar.login')}
										</a>
									</Link>
								</li>
								<li className={router.pathname == '/register' ? 'nav-item active-link' : 'nav-item'}>
									<Link href="/register">
										<a className="nav-links button" onClick={closeMobileMenu}>
											{t('navbar.register')}
										</a>
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</nav>
		</>
	)
}

export default Navbar
