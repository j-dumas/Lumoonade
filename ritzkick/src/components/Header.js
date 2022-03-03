import { connection } from 'mongoose'
import React, { useCallback, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { getCookie } from 'services/CookieService'

function Header() {
	const [mobile, setMobile] = useState(true)
	const [isConnected, setConnection] = useState(false)

	const handleResize = useCallback(() => {
		if (window.innerWidth >= 1100) setMobile(false)
		else setMobile(true)
	}, [])

	const connection = () => {
		//todo: validation on token
		if (getCookie('token') != undefined) setConnection(true)
		else setConnection(false)
	}

	useEffect(() => {
		handleResize()
		connection()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [handleResize])

	return (
		<>
			<header className="row center left">
				<Navbar mobile={mobile} connected={isConnected} />
			</header>
		</>
	)
}

export default Header
