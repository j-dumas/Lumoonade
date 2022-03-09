import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from '@/components/AndSeparator'
import Separator from '@/components/Separator'
import { login } from 'services/AuthService'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from '@mui/material'
import { useForm } from '@/components/hooks/useForm'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getCookie } from 'services/CookieService'

const GoogleSignIn = dynamic(() => import('@/components/GoogleSignIn'))

const LoginForm = () => {
	const { t } = useTranslation('forms')

	const [state, handleChange] = useForm({})
	const [passShow, setPassShow] = useState(false)
	const [error, setError] = useState(false)
	const router = useRouter()

	const handleClickShowPassword = (event) => {
		setPassShow(!passShow)
	}

	const handleError = () => {
		setError(true)
	}

	const handleSubmit = async (event) => {
		if (state.email !== undefined && state.password !== undefined) {
			event.preventDefault()
			await login(state.email, state.password, handleError).then((res) => {
				if (res === 200) {
					router.push({ pathname: '/profile', query: { login: true }})
				}
			})
		}
	}

	return (
		<Container className="column p-3 form">
			<h1 className="form-title">{t('login.title')}</h1>
			<form onSubmit={handleSubmit}>
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-courriel">{t('fields.email')}</InputLabel>
					<OutlinedInput
						name="email"
						id="outlined-adornment-courriel"
						type="email"
						onChange={handleChange}
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
				{!!error && (
					<FormHelperText error id="error-input" sx={{ textAlign: 'center' }}>
						Mauvais courriel ou mot de passe.
					</FormHelperText>
				)}
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-password">{t('fields.password')}</InputLabel>
					<OutlinedInput
						className="test"
						name="password"
						id="outlined-adornment-password"
						type={passShow ? 'text' : 'password'}
						onChange={handleChange}
						endAdornment={
							<InputAdornment position='end'>
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
				<Link href="/forgotPassword">
					<div className="link">{t('login.forgot-password')}</div>
				</Link>
			</form>
			<AndSeparator />
			<GoogleSignIn />

			<div>
				<Separator />
				<div className="row">
					<p>{t('login.no-account')}</p>
					<Link href="/register">
						<div className="link">{t('login.register')}</div>
					</Link>
				</div>
			</div>
		</Container>
	)
}

export default LoginForm
