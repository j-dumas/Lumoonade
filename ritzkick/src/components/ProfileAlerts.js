import React, { useEffect, useState } from 'react'
import { getWatchList } from 'services/UserService'
import ProfileAddAlerts from '@/components/ProfileAddAlerts'
import ProfileAlertsComponent from '@/components/ProfileAlertsComponent'
import { Snackbar, Alert } from '@mui/material'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import { createSocket } from '../../services/SocketService'
import { SlugToSymbol, AreSlugsEqual } from '../../utils/crypto'
import format from '../../utils/formatter'
import { CircularProgress } from '@mui/material'

export default function ProfileAlerts(props) {
	const [socket, setSocket] = useState()
	const [alerts, setAlerts] = useState([])
	const [data, setData] = useState([])
	const [openStatus, setOpen] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)

	function deletedAlert() {
		setOpen(true)
	}

	function handleClose(event, reason) {
		if (reason === 'clickaway') return
		setOpen(false)
	}

	function fetchAssets(page = currentPage) {
		setCurrentPage(page)
		getWatchList(page)
			.then((res) => {
				setMaxPage(res.max_page)
				setAlerts(res.watchlists)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	useEffect(() => {
		fetchAssets()
	}, [])

	useEffect(() => {
		if (!alerts) return
		let symbols = []
		alerts.forEach((alert) => {
			symbols.push(SlugToSymbol(alert.slug, props.currency))
		})
		setSocket(createSocket(['general'], symbols, `wss://${window.location.host}`))
	}, [alerts, alerts.length == 0, currentPage])

	useEffect(() => {
		if (!socket) return
		socket.on('data', (slugs) => {
			setData(slugs)
		})
		if (socket) return () => socket.disconnect()
	}, [socket])

	return (
		<div id="alerts column center">
			<div id="alerts-header" className="row">
				<h1>Alerte(s)</h1>
					<ProfileAddAlerts currency={props.currency} onDataChange={fetchAssets} />
				<Snackbar
					sx={{ m: 6 }}
					open={openStatus}
					autoHideDuration={6000}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				>
					<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
						Alerte supprimée!
					</Alert>
				</Snackbar>
			</div>
			{
				(alerts === undefined || socket === undefined) 
					?
						<div className='column center'>
							<CircularProgress color="secondary" />
						</div>
					:
					(alerts.length !== 0)
						?
							(!socket.connected)
								?
									<div className='column center'>
										<CircularProgress color="secondary" />
									</div>
								:
									<div>
										<ul>
											<li>
												<div className='row alert-card alert-title-card'>
													<div>
														Name
													</div>
													<div>
														Current Price
													</div>
													<div>
														Target Price
													</div>
												</div>
											</li>
											{
												alerts.map((alert) => {
													let price = 0
													data.forEach((asset) => {
														if (AreSlugsEqual(alert.slug, asset.fromCurrency)) price = asset.regularMarketPrice
													})

													return <li key={alert._id}>
														<ProfileAlertsComponent price={format(price)} onDelete={deletedAlert} onDataChange={fetchAssets} alert={alert} />
													</li>
												})
											}
										</ul>
									</div>
								:
									<h1>Aucune alerte</h1>
			}
				<div className='row center'>
					{
						(currentPage > 1) 
						&&
							<button className='alert-page-control-buttons row center' onClick={() => fetchAssets(currentPage - 1)}>
								<ArrowLeft />
								<div>
									Previous Page
								</div>
							</button>
					}
					<div>
						{currentPage}
					</div>
					{
						(currentPage < maxPage) 
						&& 
							<button className='alert-page-control-buttons row center' onClick={() => fetchAssets(currentPage + 1)}>
								<div>
									Next Page 
								</div>
								<ArrowRight />
							</button>
					}
				</div>
		</div>
	)
}
