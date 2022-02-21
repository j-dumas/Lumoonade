import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import React, { useState, useEffect } from 'react'
import SimpleCryptoCardDashboard from '../components/SimpleCryptoCardDashboard'
import GetCryptoData from '../services/CryptoService'
import Functions from '../services/CryptoService'
const io = require('socket.io-client')

export default function Assets() {
	const [data, setData] = useState([]) // GetTopPopularCryptocurrencies()

	const [list, setList] = useState([])

	const [socket, setSocket] = useState()

	useState(async () => {
		//let assets = await Functions.GetTopPopularCryptocurrencies()
		//let list = assets.assets
		//setList(list)

		//setList['btc', 'eth']

		setSocket(
			io('http://localhost:3000/', {
			auth: {
				rooms: ['general', `graph-1d-30m`],
				query: ['btc-cad', 'eth-cad', 'ltc-cad', 'ada-cad', 'bnb-cad', 'doge-cad'],
				graph: true
			}
			})
		)
	}, [])

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
				<SimpleCryptoCardDashboard socket={socket}/>
			</section>

			<Footer />
		</div>
	)
}
/*
	<div key={element.slug}>
		<p>{element.slug}</p>
	</div>
	*/