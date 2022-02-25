import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from './AndSeparator'
import Separator from './Separator'
import Link from 'next/link'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@mui/material'

export default function ForgotPasswordForm(){

	const [email, setEmail] = useState(undefined)
	const [open, setOpen] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()
		try{
			let response = await fetch('/api/reset', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({email: email})
			})
	
			console.log(response.status)
			setOpen(true)
		}
		catch(e){
			console.log(e)
		}
	}

	function handleEmailChange(event) {
		setEmail(event.target.value)
	}

	function handleClose(event, reason){
		if (reason === 'clickaway') {
		  return;
		}
	
		setOpen(false);
	  };

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
				<Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
					<Alert onClose={handleClose} severity="success">{"Un email de confirmation a été envoyé à " + email}</Alert>
				</Snackbar>
			</Container>
	)
}
