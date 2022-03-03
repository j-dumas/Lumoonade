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

	useEffect(async () => {
		const data = await getFavorites()
		let slugs = []
		data.map((favorite) => {
			slugs.push(favorite.slug)
		})
		const symbols = SlugArrayToSymbolArray(slugs, CURRENCY, false)
		setSocket(createSocket(['general', `graph-${dateRange}-${interval}`], symbols, `wss://${window.location.host}/`))
	}, [])

	return !socket ? (
		<div className="column center">
			<CircularProgress color="secondary" />
		</div>
	) : (
		<div id="favorites">
			<h1>Favoris</h1>
			<SimpleCryptoDashboard socket={socket} />
		</div>
	)
}
