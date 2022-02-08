import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BottomArrow from '../components/BottomArrow'
import SimpleCryptoDashboard from '../components/SimpleCryptoDashboard'
import React, { useState, useEffect } from 'react'
import GetCryptoData from '../services/CryptoService'

const TITLE = 'CRYPTOOL'
const SUB_TTTLE = "Restez à l'affut de vos cryptos favorites"

export default function Home() {
	const [data, setData] = useState(GetCryptoData())

	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'CRYPTOOL | HOME',
					description: 'Cryptool home page',
				}}
			/>
			<Header />

			<main className='column'>
				<section className='section row principal center'>
					<div className='column center'>
						<div className='column center'>
							<h1 className='website-title item'>{TITLE}</h1>
							<h2 className='subtitle item'>{SUB_TTTLE}</h2>
						</div>
					</div>
				</section>
				<BottomArrow />
			</main>

			<svg
				className='svg svg-transit'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 1440 320'
			>
				<path
					fill='#0099ff'
					fillOpacity='1'
					d='M0,128L205.7,192L411.4,128L617.1,192L822.9,32L1028.6,64L1234.3,192L1440,96L1440,320L1234.3,320L1028.6,320L822.9,320L617.1,320L411.4,320L205.7,320L0,320Z'
				></path>
			</svg>
			<section className='section row second'>
				<SimpleCryptoDashboard data={data} />
			</section>

			<Footer />
		</div>
	)
}
