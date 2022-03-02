import DomHead from '@/components/DomHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import React, { useState, useEffect } from 'react'
import SimpleCryptoCardDashboard from '@/components/SimpleCryptoCardDashboard'
import Functions from 'services/CryptoService'
import { getFavorites } from 'services/UserService'
import { isUserConnected } from 'services/AuthService'
import { SlugArrayToSymbolArray } from 'utils/crypto'
import { createSocket } from 'services/SocketService'

const CURRENCY = 'usd'

export default function Assets() {
	const [searchList, setSearchList] = useState([])

	const [socket, setSocket] = useState()
	const [favSocket, setFavSocket] = useState()

	useEffect(async () => {
		if (isUserConnected()) {
			let symbols = SlugArrayToSymbolArray(await getFavorites(), CURRENCY, false)
			setFavSocket(createSocket(['general', `graph-1d-30m`], symbols))
		}

		//let symbols = await Functions.GetTopGainersCryptocurrencies(8)
		//let list = SlugArrayToSymbolArray(symbols.assets, CURRENCY)
		let list = ['btc-usd', 'eth-usd', 'bnb-usd', 'ltc-usd', 'ada-usd', 'doge-usd', 'shib-usd', 'theta-usd']
		setSocket(createSocket(['general', `graph-1d-1h`], list))
	}, [])

	useEffect(() => {
		if (socket) socket.emit('update', socket.id, searchList)
	}, [searchList])

	async function updateSearchList(event) {
		event.preventDefault()
		const search = event.target[0].value
		if (!search || search == undefined || search == '') return

		let symbols = []
		let list = await Functions.GetSCryptocurrencySlugsBySeach(search, 0, 8)
		list.assets.map((element) => symbols.push(element.symbol + '-' + CURRENCY))
		setSearchList(symbols)
	}

	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'CRYPTOOL | ASSETS',
					description: 'Cryptool assets page'
				}}
			/>
			<Header />

			<section className="section column center principal first">
				<section className="sub-section">
					<div className="page-menu space-between row h-center">
						<div className="row h-center detailed-menu-info">
							<h1 className="detailed-menu-title">Markets</h1>
						</div>
						<form action="" onSubmit={updateSearchList}>
							<input type="search" />
							<button type="submit" value="Submit">
								Search
							</button>
						</form>
						<div className="detailed-menu-actions row h-center"></div>
					</div>
				</section>

				<section className="sub-section">
					{socket ? (
						<>
							{favSocket ? (
								<>
									<h1>Favorites</h1>
									<SimpleCryptoCardDashboard socket={favSocket} />
								</>
							) : null}
							<h1>Assets</h1>
							<SimpleCryptoCardDashboard socket={socket} />
						</>
					) : null}
				</section>
			</section>

			<Footer />
		</div>
	)
}
