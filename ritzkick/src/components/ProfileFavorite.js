import React, { useEffect, useState } from 'react'
import SimpleCryptoDashboard from '@/components/SimpleCryptoDashboard'
import { getFavorites, getFavoritesMaxPage } from 'services/UserService'
import { SlugArrayToSymbolArray } from 'utils/crypto'
import { createSocket } from 'services/SocketService'
import { CircularProgress } from '@mui/material'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'

const CURRENCY = 'cad'
const PAGE_LIMIT = 5

export default function ProfileFavorite() {
	const [socket, setSocket] = useState()
	const [dateRange, setDateRange] = useState('1d')
	const [interval, setInterval] = useState('1h')
	const [data, setData] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)

	function fetchFavorites(page = currentPage) {
		setCurrentPage(page)
		getFavorites(PAGE_LIMIT, page).then((res) => setData(res))
		getFavoritesMaxPage(PAGE_LIMIT).then((res) => setMaxPage(res))
	}

	useEffect(() => {
		fetchFavorites()
	}, [])

	useEffect(() => {
		if (data.length > 0) {
			let slugs = []
			data.map((favorite) => {
				slugs.push(favorite.slug)
			})
			const symbols = SlugArrayToSymbolArray(slugs, CURRENCY, false)
			setSocket(
				createSocket(['general', `graph-${dateRange}-${interval}`], symbols, `wss://${window.location.host}`)
			)
		}
	}, [data, data.length == 0, currentPage])

	return !socket ? (
		<div className="column center">
			<CircularProgress color="secondary" />
		</div>
	) : (
		<div id="favorites">
			{data.length !== 0 ? (
				<div>
					<h1>Favoris</h1>
					<SimpleCryptoDashboard socket={socket} />
				</div>
			) : (
				<h1>Aucun favoris</h1>
			)}
			<div className="row center">
				{currentPage > 1 && (
					<button
						className="alert-page-control-buttons row center"
						onClick={() => fetchFavorites(currentPage - 1)}
					>
						{' '}
						<ArrowLeft />
						Previous Page
					</button>
				)}
				<div>{currentPage}</div>
				{currentPage < maxPage && (
					<button
						className="alert-page-control-buttons row center"
						onClick={() => fetchFavorites(currentPage + 1)}
					>
						Next Page <ArrowRight />
					</button>
				)}
			</div>
		</div>
	)
}
