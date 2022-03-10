import React, { useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

import { useTranslation } from 'next-i18next'

export default function ProfilePurge(props) {
	const { t } = useTranslation('profile')

	const [openStatus, setOpenStatus] = useState(false)
	const [deletedSessions, setDeletedSessions] = useState(props.user.sessions - 1)

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
		setDeletedSessions(props.user.sessions - 1)
	}

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
					{`${deletedSessions} ${t('sessions.deleted')}`}
				</Alert>
			</Snackbar>
			<h2>{`${t('sessions.have')} ${props.user.sessions} ${t('sessions.active')}`}</h2>
			<button
				id="purge-session"
				onClick={(event) => {
					removeUserSession(event)
				}}
			>
				{t('sessions.delete')}
			</button>
		</div>
	)
}
