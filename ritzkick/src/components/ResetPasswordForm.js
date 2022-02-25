import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import { useForm } from './hooks/useForm'
import {
	InputLabel,
	OutlinedInput,
	FormControl,
	IconButton,
	InputAdornment,
	styled,
	FormHelperText
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export default function ResetPasswordForm() {
	const router = useRouter()
	const { key } = router.query

	const [state, handleChange] = useForm([])
	const [showPassword, setShowPassword] = useState(false)
	const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
	const [error, setError] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()
		if (state.password === state.passwordConfirmation) {
			try {
				let response = await fetch('/api/reset/redeem', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						resetToken: key,
						password: state.password,
						confirmation: state.passwordConfirmation
					})
				})

				console.log(response.status)
				window.location.assign('/login')
			} catch (e) {
				console.log(e)
			}
		} else {
			setError(true)
		}
	}

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}
	const handleClickShowPasswordConfirmation = () => {
		setShowPasswordConfirmation(!showPasswordConfirmation)
	}

	return (
		<Container className="p-3 form">
			<h1 className="form-title">Problème de connexion?</h1>
			<form method="POST" onSubmit={(event) => handleSubmit(event)}>
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
					<OutlinedInput
						name="password"
						id="outlined-adornment-password"
						type={showPassword ? 'text' : 'password'}
						onChange={handleChange}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onMouseDown={handleClickShowPassword}
									onMouseUp={handleClickShowPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						fullWidth
						required
						inputProps={{ minLength: 8 }}
					/>
				</FormControl>
				{!!error && (
					<FormHelperText error id="error-input" sx={{ textAlign: 'center' }}>
						Les mots de passe ne sont pas identiques
					</FormHelperText>
				)}
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-password-confirmation">Password Confirmation</InputLabel>
					<OutlinedInput
						name="passwordConfirmation"
						id="outlined-adornment-password-confirmation"
						type={showPasswordConfirmation ? 'text' : 'password'}
						onChange={handleChange}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onMouseDown={handleClickShowPasswordConfirmation}
									onMouseUp={handleClickShowPasswordConfirmation}
									edge="end"
								>
									{showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						required
						inputProps={{ minLength: 8 }}
					/>
				</FormControl>
				<input type="submit" value="Modifier"></input>
			</form>
		</Container>
	)
}
