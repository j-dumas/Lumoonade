import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import React, { useState, useEffect } from 'react'
import SimpleCryptoCardDashboard from '../components/SimpleCryptoCardDashboard'
import Functions from '../services/CryptoService'
import { getFavorites } from '../services/UserService'
import { isUserConnected } from '../services/AuthService'
import {SlugArrayToSymbolArray} from '../utils/crypto'
const io = require('socket.io-client')

const CURRENCY = "usd"

export default function Assets() {
	const [isSocketReady, setIsSocketReady] = useState(false)

	const [favList, setFavList] = useState([])
	const [searchList, setSearchList] = useState([])

	const [socket, setSocket] = useState()
	const [favSocket, setFavSocket] = useState()

	async function updateSearchList(event) {
		event.preventDefault()
		let search = event.target[0].value
		if (!search || search == undefined || search == "") return
		let list = await Functions.GetSCryptocurrencySlugsBySeach(search, 0, 16)
		let symbols = []
		list.assets.map((element) => {
			symbols.push(element.symbol+'-'+CURRENCY)
		})
		console.log(symbols)
		setSearchList(symbols)
	}
	
	useEffect(async () => {
		if (!isUserConnected()) return
		let slugs = await getFavorites()
		let symbols = SlugArrayToSymbolArray(slugs, CURRENCY, false)
		setFavList(symbols)
	}, [])

	useEffect(() => {
		setSocket(
			io('http://localhost:3000/', {
				auth: {
					rooms: ['general', `graph-1d-30m`],
					query: ['btc-cad', 'eth-cad', 'ltc-cad', 'ada-cad', 'bnb-cad', 'doge-cad'],
					graph: true
				}
			})
		)

		if (!isUserConnected()) return
		console.log('fav socket')
		setFavSocket(
			io('http://localhost:3000/', {
				auth: {
					rooms: ['general', `graph-1d-30m`],
					query: [],
					graph: true
				}
			})
		)
	}, [])

	useEffect(()=> {
		if (socket) {
			socket.on('ready', () => {
				setIsSocketReady(true)
				console.log('test true')
			})

			socket.on('executed', () => {
				setIsSocketReady(true)
				console.log('query executed')
			})
		}

		if (socket) {
			socket.emit('update', socket.id, searchList)
			console.log(isSocketReady)
		}

		if (favSocket) {
			favSocket.on('ready', () => { 
				favSocket.emit('update', favSocket.id, favList)
			})
		}
	}, [searchList, favList])

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
				<section className='sub-section'>
					<div className="page-menu space-between row h-center">
						<div className="row h-center detailed-menu-info">
							<h1 className="detailed-menu-title">Markets</h1>
						</div>
						<form action="" onSubmit={updateSearchList}>
									<input type="search" />
									<button type="submit" value="Submit">Search</button>
						</form>
						<div className="detailed-menu-actions row h-center"></div>
					</div>
				</section>
				
				<section className='sub-section'>
					{socket ? <>
					{favSocket && favList.length > 0?
					<>
						<h1>Favorites</h1>
						<SimpleCryptoCardDashboard socket={favSocket}/>
					</>
					:null}
					<h1>Assets</h1>
					<SimpleCryptoCardDashboard socket={socket}/>
					</>
					:null}
				</section>
			</section>

			<Footer />
		</div>
	)
}