import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import AndSeparator from '../AndSeparator'
import Separator from '../Separator'
import GoogleSignIn from '../GoogleSignIn'
import { login } from '../../services/AuthService'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Email, Password, Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material'

const LoginForm = () => {
	const { t } = useTranslation('forms')

	const [email, setEmail] = useState(undefined)
	const [password, setPassword] = useState(undefined)
	const [passShow, setPassShow] = useState(false)

	const handleEmailChange = (event) => {
		setEmail(event.target.value)
	}

	const handlePasswordChange = (event) => {
		setPassword(event.target.value)
	}

	const handleClickShowPassword = (event) => {
		setPassShow(!passShow)
	}

	const handleSubmit = async (event) => {
		if(email !== undefined && password !== undefined){
			event.preventDefault()
			await login(email, password)
		}
	}

	return (
		<Container className="p-3 form">
			<h1 className="form-title">{t('login.title')}</h1>
			<div className="wrong" id="wrong">
				Mauvais courriel ou mot de passe.
			</div>
			<form onSubmit={handleSubmit}>
				<FormControl className='inputField' sx={{ m: 1, width: '100%' }} variant="filled">
					<InputLabel htmlFor="outlined-adornment-courriel">{t('fields.email')}</InputLabel>
					<OutlinedInput
						id="outlined-adornment-courriel"
						type="email"
						onChange={handleEmailChange}
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
				<FormControl className='inputField' sx={{ m: 1, width: '100%' }} variant="filled">
					<InputLabel htmlFor="outlined-adornment-password">{t('fields.password')}</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						type={passShow ? "text" : "password"}
						onChange={handlePasswordChange}
						startAdornment={
							<InputAdornment position='end'>
								<Password />
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
						inputProps={{minLength: 8}}
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
