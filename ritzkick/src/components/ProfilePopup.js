import React, { useEffect, useState } from 'react'
import Icons from '@/components/Icons'
import { useModal } from 'react-hooks-use-modal'
import { deleteUser, updateUser } from 'services/UserService'
import { useForm } from '@/components/hooks/useForm'
import { AccountCircle, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'

const newUsername = 'newUsername'
const oldPass = 'oldPass'
const newPass = 'newPass'
const newPassConfirmation = 'newPassConfirmation'

export default function ProfilePopup(props) {
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

	function eraseFieldValue() {
		resetValues()
	}

	function deleteAuthUser() {
		if (confirm('Êtes-vous sur de vouloir supprimer votre compte?')) {
			deleteUser()
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
				if (confirm('Êtes-vous sur de vouloir modifier votre profile?')) {
					updateUser(
						event,
						props.username,
						values.newUsername,
						values.oldPass,
						values.newPass,
						values.newPassConfirmation
					)
				}
			}
		}
	}

	useEffect(() => {
		if (!isOpen) {
			eraseFieldValue()
		}
	}, [isOpen])

	return (
		<div>
			<button className="icon-button" onClick={open}>
				<Icons.Edit id="icon" />
			</button>
			<Modal>
				<div className="edit-popup">
					<form
						id="update-form"
						onSubmit={(event) => {
							handleSubmit(event)
						}}
					>
						<h1>Modification de profile</h1>
						<div className="wrong" id="wrong-name">
							Le nom que vous désirez entrer est déjà utilisé
						</div>
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-username">Nom d&apos;utilisateur</InputLabel>
							<OutlinedInput
								name={newUsername}
								id="outlined-adornment-username"
								type="text"
								defaultValue={props.username}
								onChange={handleChange}
								startAdornment={
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
							<InputLabel htmlFor="outlined-adornment-courriel">Courriel</InputLabel>
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
						<label>Entrez votre ancien mot de passe ainsi que le nouveau</label>
						<div className="wrong" id="wrong-password">
							Veuillez vérifier si tous les champs ci dessous concorde bien
						</div>
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
							<OutlinedInput
								name={oldPass}
								id="outlined-adornment-password"
								type={passwordValues.oldPassShow ? 'text' : 'password'}
								onChange={handleChange}
								startAdornment={
									<InputAdornment position="end">
										<Lock />
									</InputAdornment>
								}
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
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-new-password">Nouveau mot de passe</InputLabel>
							<OutlinedInput
								name={newPass}
								id="outlined-adornment-new-password"
								type={passwordValues.newPassShow ? 'text' : 'password'}
								onChange={handleChange}
								startAdornment={
									<InputAdornment position="end">
										<Lock />
									</InputAdornment>
								}
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
						<FormControl className="inputField" sx={{ m: 1, width: '100%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-new-confirmation-password">
								Confirmation nouveau mot de passe
							</InputLabel>
							<OutlinedInput
								name={newPassConfirmation}
								id="outlined-adornment-new-confirmation-password"
								type={passwordValues.newPassConfirmationShow ? 'text' : 'password'}
								onChange={handleChange}
								startAdornment={
									<InputAdornment position="end">
										<Lock />
									</InputAdornment>
								}
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
						<input type="submit" value="Modifier" />
						<button type="button" onClick={close} id="cancel-edit">
							Annuler
						</button>
					</form>
					<a className="link" onClick={deleteAuthUser}>
						Supprimer mon compte
					</a>
				</div>
			</Modal>
		</div>
	)
}
