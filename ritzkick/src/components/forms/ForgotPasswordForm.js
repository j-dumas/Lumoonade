import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from '@/components/AndSeparator'
import Separator from '@/components/Separator'
import Link from 'next/link'
import Snackbar from '@mui/material/Snackbar'
import { sendForgotPassword } from 'services/AuthService'
import { Email } from '@mui/icons-material'
import { Alert, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'

import { useTranslation } from 'next-i18next'

export default function ForgotPasswordForm() {
	const { t } = useTranslation('forms')

	const [email, setEmail] = useState(undefined)
	const [open, setOpen] = useState(false)
	const [confirmation, setConfirmation] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()
		sendForgotPassword(email).then((status) => {
			if (status === 201) {
				setOpen(true)
			}
		})
	}

	function handleResend(event) {
		handleSubmit(event)
		setConfirmation(true)
	}

	function handleEmailChange(event) {
		setEmail(event.target.value)
	}

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	function handleConfirmationClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}

		setConfirmation(false)
	}

	return (
		<div className="front">
			<Snackbar
				sx={{ m: 6 }}
				open={open}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
			>
				<Alert onClose={handleClose} severity="success">
					{`${t('forgot.sent')} ${email}`}
					<button id="resend-email-button" onClick={handleResend}>
						{t('forgot.resend')}
					</button>
				</Alert>
			</Snackbar>
			<Snackbar
				sx={{ m: 6, marginTop: 14 }}
				open={confirmation}
				onClose={handleConfirmationClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
			>
				<Alert onClose={handleConfirmationClose} severity="success">
					{`${t('forgot.sent')} ${email}`}
				</Alert>
			</Snackbar>
			<Container className="form">
				<h1 className="form-title">{t('forgot.title')}</h1>
				<h4>{t('forgot.description')}</h4>
				<form method="POST" onSubmit={(event) => handleSubmit(event)}>
					<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
						<InputLabel htmlFor="outlined-adornment-courriel">{t('forgot.field')}</InputLabel>
						<OutlinedInput
							name="email"
							id="outlined-adornment-courriel"
							type="email"
							onChange={handleEmailChange}
							endAdornment={
								<InputAdornment position="end">
									<Email />
								</InputAdornment>
							}
							fullWidth
							required
							autoComplete="off"
						/>
					</FormControl>
					<input type="submit" value={t('forgot.submit')}></input>
				</form>
				<AndSeparator />
				<Link href="/register">
					<a className="link">{t('forgot.register')}</a>
				</Link>
				<Separator />
				<Link href="/login">
					<a className="link">{t('forgot.back')}</a>
				</Link>
			</Container>
		</div>
	)
}
