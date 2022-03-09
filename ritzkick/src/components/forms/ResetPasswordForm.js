import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import { useForm } from '@/components/hooks/useForm'
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

import { useTranslation } from 'next-i18next'
import { resetPassword } from 'services/AuthService'

export default function ResetPasswordForm() {
	const { t } = useTranslation('forms')
	const router = useRouter()
	const { key } = router.query

	const [state, handleChange] = useForm([])
	const [showPassword, setShowPassword] = useState(false)
	const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
	const [error, setError] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()
		if (state.password === state.passwordConfirmation) {
			resetPassword(key, state.password, state.passwordConfirmation).then((status) => {
				if (status === 200) {
					router.push('/login')
				}
			})
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
		<Container className="form">
			<h1 className="form-title">{t('reset.title')}</h1>
			<form method="POST" onSubmit={(event) => handleSubmit(event)}>
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-password">{t('reset.password')}</InputLabel>
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
						{t('validation.reset')}
					</FormHelperText>
				)}
				<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
					<InputLabel htmlFor="outlined-adornment-password-confirmation">
						{t('reset.confirmation')}
					</InputLabel>
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
				<input type="submit" value={t('reset.submit')}></input>
			</form>
		</Container>
	)
}
