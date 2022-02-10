import DomHead from '../components/DomHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import SimpleCryptoCard from '../components/SimpleCryptoCard';
import GetCryptoData from '../services/CryptoService';

export default function Assets() {
	const [data, setData] = useState(GetCryptoData());

	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'CRYPTOOL | ASSETS',
					description: 'Cryptool assets page'
				}}
			/>
			<Header />

			<section className="section row center principal first">
				{data.map((element, i) => {
					return (
						<div key={element}>
							<SimpleCryptoCard data={element} />
						</div>
					);
				})}
			</section>

			<Footer />
		</div>
	);
}
