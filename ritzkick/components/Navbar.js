import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Icons from './Icons'
import Link from 'next/link'
//import { Link } from 'react-router-dom';

function Navbar(props) {
	const router = useRouter()

	const [click, setClick] = useState(false)
	const handleClick = () => setClick(!click)
	const closeMobileMenu = () => setClick(false)

	const [isScrolled, setIsScrolled] = useState(false)

	async function logout(event) {
		event.preventDefault()
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + sessionStorage.token
				}
			})

			sessionStorage.clear()
			window.location.href = '/'
		} catch (e) {
			console.log(e)
		}
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
							<Link href="/" className="nav-links" onClick={closeMobileMenu}>
								Home
							</Link>
						</li>
						<li className={router.pathname == '/assets' ? 'nav-item active-link' : 'nav-item'}>
							<Icons.Coins />
							<Link href="/assets" className="nav-links" onClick={closeMobileMenu}>
								Assets
							</Link>
						</li>
						<li className={router.pathname == '/podium' ? 'nav-item active-link' : 'nav-item'}>
							<Icons.ChartLine />
							<Link href="/compare" className="nav-links" onClick={closeMobileMenu}>
								Compare
							</Link>
						</li>
						<li className={router.pathname == '/help' ? 'nav-item active-link' : 'nav-item'}>
							<Icons.InfoCircle />
							<Link href="/help" className="nav-links" onClick={closeMobileMenu}>
								Help Center
							</Link>
						</li>
					</ul>
					<ul className={props.mobile ? 'nav-menu-mobile' : 'nav-menu'}>
						{props.connected ? (
							<>
								<li className={router.pathname == '/wallet' ? 'nav-item active-link' : 'nav-item'}>
									<Icons.Wallet />
									<Link href="/wallet" className="nav-links" onClick={closeMobileMenu}>
										Wallet
									</Link>
								</li>
								<li className={router.pathname == '/profile' ? 'nav-item active-link' : 'nav-item'}>
									<Icons.UserCircle />
									<Link href="/profile" className="nav-links" onClick={closeMobileMenu}>
										Profile
									</Link>
								</li>
								<li className={router.pathname == '/logout' ? 'nav-item active-link' : 'nav-item'}>
									<Icons.DoorOpen />
									{
										<Link className="nav-links" onClick={(closeMobileMenu, logout)}>
											Log out
										</Link>
									}
								</li>
							</>
						) : (
							<>
								<li className={router.pathname == '/login' ? 'nav-item active-link' : 'nav-item'}>
									<div className="nav-icons">
										<Icons.DoorClosed />
									</div>
									<Link href="/login" className="nav-links" onClick={closeMobileMenu}>
										Log in
									</Link>
								</li>
								<li className={router.pathname == '/register' ? 'nav-item active-link' : 'nav-item'}>
									<Link href="/register" className="nav-links button" onClick={closeMobileMenu}>
										Register
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
