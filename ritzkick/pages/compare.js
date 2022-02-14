import React, { useState, useEffect } from 'react';
import DomHead from '../components/DomHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
//import DetailedChart from '../components/DetailedChart';
import GetCryptoData from '../services/CryptoService';
import CompareMenu from '../components/CompareMenu'

// Exemple d'URL: localhost:3000/compare?assets=ETH-BNB
export default function Compare() {
	const [data, setData] = useState();

	return (
		<>
			<DomHead />
			<Header />

			<section className="section column principal first center">
				<CompareMenu/>
			</section>

			<Footer />
		</>
	);
}
// slug={assetData.slug}