import React, { useEffect, useState } from 'react'
import SimpleCryptoDashboard from '@/components/SimpleCryptoDashboard'
import { getFavorites } from 'services/UserService'
import ButtonFavorite from './ButtonFavorite'
import { SlugArrayToSymbolArray } from 'utils/crypto'
import { createSocket } from 'services/SocketService'
import { CircularProgress } from '@mui/material'

const CURRENCY = 'usd'

export default function ProfileFavorite() {
	const [socket, setSocket] = useState()
	const [dateRange, setDateRange] = useState('1d')
	const [interval, setInterval] = useState('1h')
	const [data, setData] = useState([])

	useEffect(async () => {
		const favorites = await getFavorites()
		setData(favorites)
		let slugs = []
		favorites.map((favorite) => {
			slugs.push(favorite.slug)
		})
		const symbols = SlugArrayToSymbolArray(slugs, CURRENCY, false)
		setSocket(createSocket(['general', `graph-${dateRange}-${interval}`], symbols, `wss://${window.location.host}`))
	}, [])

	return !socket ? (
		<div className="column center">
			<CircularProgress color="secondary" />
		</div>
	) : (
		<div id="favorites">
			{
				(data.length !== 0) 
					? 
						<div>
							<h1>Favoris</h1>
							<SimpleCryptoDashboard socket={socket} /> 
						</div>
					: 
						<h1>Aucun favoris</h1>
			}
		</div>
	)
}
