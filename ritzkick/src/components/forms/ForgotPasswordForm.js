import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from '@/components/AndSeparator'
import Separator from '@/components/Separator'
import Link from 'next/link'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@mui/material'
import { sendForgotPassword } from 'services/AuthService'

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
		<Container className="p-3 form">
			<h1 className="form-title">Problème de connexion?</h1>
			<h4>Entrez votre adresse courriel et nous vous enverrons un lien pour récupérer votre compte.</h4>
			<form method="POST" onSubmit={(event) => handleSubmit(event)}>
				<input
					name="email"
					id="emailField"
					type="email"
					placeholder="Courriel"
					onChange={handleEmailChange}
					required
				></input>
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
		</Container>
	)
}
