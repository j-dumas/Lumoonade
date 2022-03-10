import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal'
import { deleteUser, updateUser } from 'services/UserService'
import { useForm } from '@/components/hooks/useForm'
import { AccountCircle, EditRounded, Email, Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material'

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const newUsername = 'newUsername'
const oldPass = 'oldPass'
const newPass = 'newPass'
const newPassConfirmation = 'newPassConfirmation'

export default function ProfilePopup(props) {
	const { t } = useTranslation('forms')

	const [Modal, open, close, isOpen] = useModal('header', {
		preventScroll: true,
		closeOnOverlayClick: false
	})
	const [values, handleChange, resetValues] = useForm({})
	const [passwordValues, setPasswordValues] = useState({
		oldPassShow: false,
		newPassShow: false,
		newPassConfirmationShow: false
	})
	const [error, setError] = useState(false)
	const router = useRouter()

	function eraseFieldValue() {
		resetValues()
	}

	function deleteAuthUser() {
		if (confirm(t('modify.delete.confirmation'))) {
			deleteUser()
			router.push({pathname: "/", query: {logout: true}})
		}
	}

	function handleClickShowPassword(event, index) {
		switch (index) {
			case 0:
				setPasswordValues({ ...passwordValues, oldPassShow: !passwordValues.oldPassShow })
				break
			case 1:
				setPasswordValues({ ...passwordValues, newPassShow: !passwordValues.newPassShow })
				break
			case 2:
				setPasswordValues({
					...passwordValues,
					newPassConfirmationShow: !passwordValues.newPassConfirmationShow
				})
				break
			default:
				break
		}
	}

	async function handleSubmit(event) {
		if (!isOpen) {
			eraseFieldValue()
		} else {
			if (
				values.newUsername === undefined &&
				values.oldPass === undefined &&
				values.newPass === undefined &&
				values.newPassConfirmation === undefined
			) {
				close()
			} else {
				if (confirm(t('modify.confirmation'))) {
					const status = await updateUser(
						event,
						props.username,
						values.newUsername,
						values.oldPass,
						values.newPass,
						values.newPassConfirmation,
						setError
					)
					if(status === 200){
						await props.updateUser()
						alert(t('modify.success'))
						close()
					}
				}
			}
		}
	}

	useEffect(() => {
		if (!isOpen) {
			eraseFieldValue()
			setError(false)
		}
	}, [isOpen])

	return (
		<div>
			<button className="icon-button" onClick={open}>
				<EditRounded />
			</button>
			<Modal>
				<div className="edit-popup">
					<form
						id="update-form"
						onSubmit={(event) => {
							handleSubmit(event)
						}}
					>
						<h1>{t('modify.title')}</h1>
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-username">{t('modify.username')}</InputLabel>
							<OutlinedInput
								name={newUsername}
								id="outlined-adornment-username"
								type="text"
								defaultValue={props.username}
								onChange={handleChange}
								endAdornment={
									<InputAdornment position="end">
										<AccountCircle />
									</InputAdornment>
								}
								fullWidth
								inputProps={{ minLength: 4 }}
								autoComplete="off"
							/>
						</FormControl>
						<hr className="form-separator"></hr>
						<FormControl
							className="inputField-disabled"
							sx={{ m: 1, width: '100%' }}
							disabled
							variant="filled"
						>
							<InputLabel htmlFor="outlined-adornment-courriel">{t('modify.email')}</InputLabel>
							<OutlinedInput
								id="outlined-adornment-courriel"
								type="email"
								defaultValue={props.email}
								startAdornment={
									<InputAdornment position="end">
										<Email />
									</InputAdornment>
								}
								fullWidth
							/>
						</FormControl>
						<hr className="form-separator"></hr>
						<label>{t('modify.passwords.label')}</label>

						{error && <div className="wrong">{t('modify.passwords.error')}</div>}
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
							<InputLabel htmlFor="outlined-adornment-password">
								{t('modify.passwords.password')}
							</InputLabel>
							<OutlinedInput
								name={oldPass}
								id="outlined-adornment-password"
								type={passwordValues.oldPassShow ? 'text' : 'password'}
								onChange={handleChange}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onMouseDown={(event) => handleClickShowPassword(event, 0)}
											onMouseUp={(event) => handleClickShowPassword(event, 0)}
											edge="end"
										>
											{passwordValues.oldPassShow ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								fullWidth
								inputProps={{ minLength: 8 }}
							/>
						</FormControl>
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
							<InputLabel htmlFor="outlined-adornment-new-password">
								{t('modify.passwords.new')}
							</InputLabel>
							<OutlinedInput
								name={newPass}
								id="outlined-adornment-new-password"
								type={passwordValues.newPassShow ? 'text' : 'password'}
								onChange={handleChange}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onMouseDown={(event) => handleClickShowPassword(event, 1)}
											onMouseUp={(event) => handleClickShowPassword(event, 1)}
											edge="end"
										>
											{passwordValues.newPassShow ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								fullWidth
								inputProps={{ minLength: 8 }}
							/>
						</FormControl>
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
							<InputLabel htmlFor="outlined-adornment-new-confirmation-password">
								{t('modify.passwords.confirmation')}
							</InputLabel>
							<OutlinedInput
								name={newPassConfirmation}
								id="outlined-adornment-new-confirmation-password"
								type={passwordValues.newPassConfirmationShow ? 'text' : 'password'}
								onChange={handleChange}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onMouseDown={(event) => handleClickShowPassword(event, 2)}
											onMouseUp={(event) => handleClickShowPassword(event, 2)}
											edge="end"
										>
											{passwordValues.newPassConfirmationShow ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								}
								fullWidth
								inputProps={{ minLength: 8 }}
							/>
						</FormControl>
						<input type="submit" value={t('modify.modify')} />
						<button type="button" onClick={close} id="cancel-edit">
							{t('modify.cancel')}
						</button>
					</form>
					<a className="link" onClick={deleteAuthUser}>
						{t('modify.delete.label')}
					</a>
				</div>
			</Modal>
		</div>
	)
}
