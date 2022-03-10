import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Icons from './Icons'
import { logout as logoutUserFunction } from 'services/AuthService'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { getCookie } from 'services/CookieService'

function Navbar(props) {
	const { t } = useTranslation('common')
	const router = useRouter()
	const { login, logout } = router.query

	const [click, setClick] = useState(false)
	const handleClick = () => setClick(!click)
	const closeMobileMenu = () => setClick(false)
	const [isConnected, setConnection] = useState(false)

	const connection = () => {
		if (getCookie('token') !== undefined) setConnection(true)
		else setConnection(false)
	}

	async function logoutUser(event) {
		event.preventDefault()
		await logoutUserFunction(setConnection()).then(() => router.push({ pathname: '/', query: { logout: true } }))
	}

	useEffect(() => {
		connection()
	}, [])

	useEffect(() => {
		if (login) {
			setConnection(true)
		}
	}, [login])

	useEffect(() => {
		if (logout) {
			setConnection(false)
		}
	}, [logout])

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
						{isConnected ? (
							<>
								<li className={router.pathname == '/me/wallet' ? 'nav-item active-link' : 'nav-item'}>
									<Icons.Wallet />
									<Link href="/me/portfolio">
										<a className="nav-links" onClick={closeMobileMenu}>
											{t('navbar.user.portfolio')}
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
								<li className="nav-item">
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
