import React, { useState, useEffect } from 'react'
import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CompareView from '../components/CompareView'

// Exemple d'URL:/compare?assets=ETH-BNB
export default function Compare() {
	const [data, setData] = useState()

	return (
		<>
			<DomHead />
			<Header />

			<section className="section column principal first center">
				<CompareView currency="CAD"/>
			</section>

			<Footer />
		</>
	)
}