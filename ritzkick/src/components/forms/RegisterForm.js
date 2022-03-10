import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import GoogleSignIn from '@/components/GoogleSignIn'
import AndSeparator from '@/components/AndSeparator'
import Separator from '@/components/Separator'
import { register } from 'services/AuthService'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useForm } from '@/components/hooks/useForm'
import { Email, Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material'
import {
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormHelperText,
	Snackbar,
	Alert,
	Checkbox
} from '@mui/material'

const RegisterForm = () => {
	const { t } = useTranslation('forms')

	const [state, handleChange] = useForm({})
	const [passShow, setPassShow] = useState(false)
	const [error, setError] = useState(false)
	const [open, setOpen] = useState(false)

	const handleClickShowPassword = () => {
		setPassShow(!passShow)
	}

	const handleError = () => {
		setError(true)
	}

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (state.email !== undefined && state.username !== undefined && state.password !== undefined) {
			const status = await register(state.email, state.username, state.password, handleError)
			if (status == 201) {
				setOpen(true)
			}
		}
	}

	return (
		<div>
			<Snackbar
				sx={{ m: 6 }}
				open={open}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
			>
				<Alert onClose={handleClose} severity="success">
					{`${t('register.email')} ${state.email}`}
				</Alert>
			</Snackbar>
			<Container className="column p-3 form">
				<h1 className="form-title">{t('register.title')}</h1>
				<form onSubmit={handleSubmit}>
					{!!error && (
						<FormHelperText className="wrong" sx={{ m: 1 }}>
							{t('validation.unique-email')}
						</FormHelperText>
					)}
					<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
						<InputLabel htmlFor="usernameField">{t('fields.username')}</InputLabel>
						<OutlinedInput
							name="username"
							id="usernameField"
							type="text"
							onChange={handleChange}
							endAdornment={
								<InputAdornment position="end">
									<AccountCircle />
								</InputAdornment>
							}
							fullWidth
							required
							inputProps={{ minLength: 4 }}
							autoComplete="off"
						/>
					</FormControl>
					<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
						<InputLabel htmlFor="emailField">{t('fields.email')}</InputLabel>
						<OutlinedInput
							name="email"
							id="emailField"
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
					<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
						<InputLabel htmlFor="passwordField">{t('fields.password')}</InputLabel>
						<OutlinedInput
							name="password"
							id="passwordField"
							type={passShow ? 'text' : 'password'}
							onChange={handleChange}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										onMouseDown={handleClickShowPassword}
										onMouseUp={handleClickShowPassword}
										edge="end"
									>
										{passShow ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
							fullWidth
							required
							inputProps={{ minLength: 8 }}
						/>
					</FormControl>
					<div className="row center">
						<Checkbox required color="secondary" />
						<Link href="/tos">
							<a className="link">{t('register.tos')}</a>
						</Link>
					</div>
					<input id="submitButton" type="submit" value={t('register.submit')} />
				</form>
				<AndSeparator />
				<GoogleSignIn />
				<div>
					<Separator />
					<div className="column">
						<h4>{t('register.existing-account')}</h4>
						<Link href="/login">
							<a className="link">{t('register.login')}</a>
						</Link>
					</div>
				</div>
			</Container>
		</div>
	)
}

export default RegisterForm
