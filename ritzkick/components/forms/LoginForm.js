import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from '../AndSeparator'
import Separator from '../Separator'
import GoogleSignIn from '../GoogleSignIn'
import { login } from '../../services/AuthService'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from '@mui/material'
import { useForm } from '../hooks/useForm'

const LoginForm = () => {
	const { t } = useTranslation('forms')

	const [state, handleChange] = useForm({})
	const [passShow, setPassShow] = useState(false)
	const [error, setError] = useState(false)

	const handleClickShowPassword = (event) => {
		setPassShow(!passShow)
	}

	const handleError = () => {
		setError(true)
	}

	const handleSubmit = async (event) => {
		if (state.email !== undefined && state.password !== undefined) {
			event.preventDefault()
			await login(state.email, state.password, handleError)
		}
	}

	return (
		<Container className="p-3 form">
			<h1 className="form-title">{t('login.title')}</h1>
			<form onSubmit={handleSubmit}>
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-courriel">{t('fields.email')}</InputLabel>
					<OutlinedInput
						name="email"
						id="outlined-adornment-courriel"
						type="email"
						onChange={handleChange}
						startAdornment={
							<InputAdornment position="end">
								<Email />
							</InputAdornment>
						}
						fullWidth
						required
						autoComplete="off"
					/>
				</FormControl>
				{!!error && (
					<FormHelperText error id="error-input" sx={{ textAlign: 'center' }}>
						Mauvais courriel ou mot de passe.
					</FormHelperText>
				)}
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-password">{t('fields.password')}</InputLabel>
					<OutlinedInput
						name="password"
						id="outlined-adornment-password"
						type={passShow ? 'text' : 'password'}
						onChange={handleChange}
						startAdornment={
							<InputAdornment position="end">
								<Lock />
							</InputAdornment>
						}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									onMouseDown={handleClickShowPassword}
									onMouseUp={handleClickShowPassword}
									edge="end"
								>
									{passShow ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						fullWidth
						required
						inputProps={{ minLength: 8 }}
					/>
				</FormControl>
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
