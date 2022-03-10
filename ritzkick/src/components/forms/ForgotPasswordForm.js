import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from '@/components/AndSeparator'
import Separator from '@/components/Separator'
import Link from 'next/link'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@mui/material'
import { sendForgotPassword } from 'services/AuthService'
import { Email } from '@mui/icons-material'
import { FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'

export default function ForgotPasswordForm() {
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
					{'Un email de confirmation a été envoyé à ' + email}
					<button id="resend-email-button" onClick={handleResend}>
						Re-send email
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
					{'Un email de confirmation a été renvoyé à ' + email}
				</Alert>
			</Snackbar>
			<Container className="form">
				<h1 className="form-title">Problème de connexion?</h1>
				<h4>Entrez votre adresse courriel et nous vous enverrons un lien pour récupérer votre compte.</h4>
				<form method="POST" onSubmit={(event) => handleSubmit(event)}>
					<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
						<InputLabel htmlFor="outlined-adornment-courriel">Courriel</InputLabel>
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
					<input type="submit" value="Envoyez"></input>
				</form>
				<AndSeparator />
				<Link href="/register">
					<a className="link">Créer un compte</a>
				</Link>
				<Separator />
				<Link href="/login">
					<a className="link">Revenir à l&apos;écran de connexion</a>
				</Link>
			</Container>
		</div>
	)
}
