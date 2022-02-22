import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from '../AndSeparator'
import Separator from '../Separator'
import GoogleSignIn from '../GoogleSignIn'
import { login } from '../../services/AuthService'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'

const LoginForm = () => {
	const { t } = useTranslation('forms')

	const [email, setEmail] = useState()
	const [password, setPassword] = useState()

	const handleEmailChange = (event) => {
		let emailField = document.getElementById('emailField')
		if (emailField.validity.typeMismatch) {
			emailField.setCustomValidity(t())
			emailField.reportValidity()
		} else {
			emailField.setCustomValidity(t('validation.email'))
			setEmail(event.target.value)
		}
	}

	const handlePasswordChange = (event) => {
		let password = document.getElementById('passwordField')
		if (password.validity.typeMismatch) {
			password.setCustomValidity(t('validation.password'))
			password.reportValidity()
		} else {
			password.setCustomValidity('')
			setPassword(event.target.value)
		}
	}

	const showError = (password, email) => {
		if (!password.validity.valid) {
			password.setCustomValidity(t('validation.password'))
			password.reportValidity()
		}
		if (!email.validity.valid) {
			email.setCustomValidity(t('validation.email'))
			email.reportValidity()
		}
	}

	const handleSubmit = async (event) => {
		let passwordField = document.getElementById('passwordField')
		let emailField = document.getElementById('emailField')

		if (!passwordField.validity.valid || !emailField.validity.valid) {
			showError(passwordField, emailField)
			event.preventDefault()
		} else {
			if (email == '' || password == '') {
				showError(passwordField, emailField)
				event.preventDefault()
			} else {
				event.preventDefault()
				await login(email, password)
			}
		}
	}

	return (
		<Container className="p-3 form">
			<h1 className="form-title">{t('login.title')}</h1>
			<div className="wrong" id="wrong">
				Mauvais courriel ou mot de passe.
			</div>
			<form onSubmit={handleSubmit}>
				<input
					id="emailField"
					type="text"
					placeholder={t('fields.email')}
					onChange={handleEmailChange}
					required
					autoComplete="off"
				/>
				<input
					id="passwordField"
					type="password"
					placeholder={t('fields.password')}
					onChange={handlePasswordChange}
					required
					autoComplete="off"
				/>
				<input id="submitButton" type="submit" onClick={handleSubmit} value={t('login.submit')} />
			</form>
			<AndSeparator />
			<GoogleSignIn />
			<Link href="/forgotPassword">
				<a className="link">{t('login.forgot-password')}</a>
			</Link>
			<div>
				<Separator />
				<div id="Signup">
					<h4>{t('login.no-account')}</h4>
					<Link href="/register">
						<a className="link">{t('login.register')}</a>
					</Link>
				</div>
			</div>
		</Container>
	)
}

export default LoginForm
