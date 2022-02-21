import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Google from './/GoogleSignIn'
import AndSeparator from './AndSeparator'
import Separator from './Separator'
import { register } from '../services/AuthService'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'

const RegisterForm = () => {
	const { t } = useTranslation('forms')

	const [username, setUsername] = useState()
	const [password, setPassword] = useState()
	const [email, setEmail] = useState()

	const handleEmailChange = (event) => {
		let email = document.getElementById('emailField')
		if (email.validity.typeMismatch) {
			email.setCustomValidity(t('validation.email'))
			email.reportValidity()
		} else {
			email.setCustomValidity('')
			setEmail(event.target.value)
		}
	}

	const handleUsernameChange = (event) => {
		let username = document.getElementById('usernameField')
		if (username.validity.typeMismatch) {
			username.setCustomValidity(t('validation.username'))
			username.reportValidity()
		} else {
			username.setCustomValidity('')
			setUsername(event.target.value)
		}
	}

	const handlePasswordChange = (event) => {
		let password = document.getElementById('passwordField')

		if (password.validity.typeMismatch) {
			password.setCustomValidity(t('validation.minimum-password'))
			password.reportValidity()
		} else {
			password.setCustomValidity('')
			setPassword(event.target.value)
		}
	}

	//https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
	const showError = (password, username, email) => {
		if (!password.validity.valid) {
			password.setCustomValidity(t('validation.minimum-password'))
			password.reportValidity()
		}
		if (!email.validity.valid) {
			if (email.validity.typeMismatch || email.validity.valueMissing) {
				email.setCustomValidity(t('validation.email'))
				email.reportValidity()
			}
		}
		if (!username.validity.valid) {
			username.setCustomValidity(t('validation.minimum-username'))
			username.reportValidity()
		}
	}

	const handleSubmit = async (event) => {
		let passwordField = document.getElementById('passwordField')
		let usernameField = document.getElementById('usernameField')
		let emailField = document.getElementById('emailField')

		if (!passwordField.validity.valid || !usernameField.validity.valid || !emailField.validity.valid) {
			showError(passwordField, usernameField, emailField)
			event.preventDefault()
		} else {
			if (username == '' || password == '' || email == '') {
				showError(passwordField, usernameField, emailField)
				event.preventDefault()
			} else {
				event.preventDefault()
				await register(email, username, password)
			}
		}
	}

	return (
		<Container className="p-3 form">
			<h1 className="form-title">{t('register.title')}</h1>
			<form onSubmit={handleSubmit} id="registerForm">
				<input
					id="usernameField"
					type="text"
					placeholder={t('fields.username')}
					onChange={handleUsernameChange}
					required
					autoComplete="off"
					minLength="4"
				/>
				<input
					id="emailField"
					type="email"
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
					minLength="8"
					autoComplete="off"
				/>
				<input id="submitButton" type="submit" onClick={handleSubmit} value={t('register.submit')} />
			</form>
			<AndSeparator />
			<Google />
			<div>
				<Separator />
				<div id="Signup">
					<h4>{t('register.existing-account')}</h4>
					<Link href="/login">
						<a className="link">{t('register.login')}</a>
					</Link>
				</div>
			</div>
		</Container>
	)
}

export default RegisterForm
