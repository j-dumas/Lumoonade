import React, { useEffect, useState } from 'react'
import { getWatchList } from '../../services/UserService'
import ProfileAddAlerts from './ProfileAddAlerts'
import ProfileAlertsComponent from './ProfileAlertsComponent'
import { Snackbar, Alert } from '@mui/material'

export default function ProfileAlerts() {
	let [data, setData] = useState([])
	const [openStatus, setOpen] = useState(false)

	function deletedAlert() {
		setOpen(true)
	}

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	function fetchData() {
		getWatchList()
			.then((res) => {
				setData(res)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<div id="alerts">
			<div id="alerts-header" className="row">
				<h1>Alertes</h1>
				<ProfileAddAlerts onDataChange={fetchData} />
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
			<ul>
				{data.map((alert) => (
					<li key={alert._id}>
						<ProfileAlertsComponent onDelete={deletedAlert} onDataChange={fetchData} alert={alert} />
					</li>
				))}
			</ul>
		</div>
	)
}
