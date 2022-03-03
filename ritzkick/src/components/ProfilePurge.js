import React, { useEffect, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

export default function ProfilePurge(props) {
	const [openStatus, setOpenStatus] = useState(false)
	const [deletedSessions, setDeletedSessions] = useState(0)

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}

		setOpenStatus(false)
	}

	async function removeUserSession(event) {
		event.preventDefault()
		setOpenStatus(true)
		props.removeSession()
	}

	useEffect(() => {
		console.log(props.user.sessions)
		// setDeletedSessions(props.user.sessions - 1)
	}, [props.user.sessions])

	return (
		<div className="column center">
			<Snackbar
				sx={{ m: 6 }}
				open={openStatus}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
			>
				<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
					{deletedSessions} Session(s) éffacée(s)!
				</Alert>
			</Snackbar>
			<h2>Vous avez présentement {props.user.sessions} session(s) active(s)</h2>
			<button
				id="purge-session"
				onClick={(event) => {
					removeUserSession(event)
				}}
			>
				Effacer les sessions inutiles
			</button>
		</div>
	)
}
