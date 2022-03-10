import { connection } from 'mongoose'
import React, { useCallback, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

function Header() {
	const [mobile, setMobile] = useState(true)

	const handleResize = useCallback(() => {
		if (window.innerWidth >= 1100) setMobile(false)
		else setMobile(true)
	}, [])

	useEffect(() => {
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [handleResize])

	return (
		<>
			<header className="row center left">
				<Navbar mobile={mobile} />
			</header>
		</>
	)
}

export default Header
