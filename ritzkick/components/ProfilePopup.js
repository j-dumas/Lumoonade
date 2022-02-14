import React, { useEffect, useCallback } from 'react'
import Icons from './Icons'
import { useModal } from 'react-hooks-use-modal'
import { deleteUser, updateUser } from '../services/UserService'

let newUsername = ''
let oldPass = ''
let newPass = ''
let newPassConfirmation = ''

function eraseFieldValue() {
	newUsername = ''
	oldPass = ''
	newPass = ''
	newPassConfirmation = ''
}

function showError(username, password, passwordConfirmation) {
	if (!passwordConfirmation.validity.valid) {
		passwordConfirmation.setCustomValidity('Entrez un mot de passe contenant 8 charactères minimum')
		passwordConfirmation.reportValidity()
	}
	if (!password.validity.valid) {
		password.setCustomValidity('Entrez un mot de passe contenant 8 charactères minimum')
		password.reportValidity()
	}
	if (!username.validity.valid) {
		username.setCustomValidity("Entrez un nom d'utilisateur contenant 4 charactères minimum")
		username.reportValidity()
	}
}

async function handleSubmit(event, oldUsername, isPopupOpen) {
	let username = document.getElementById('usernameField')
	let password = document.getElementById('passwordField')
	let passwordConfirmation = document.getElementById('passwordConfirmationField')

	if (!username.validity.valid || !password.validity.valid || !passwordConfirmation.validity.valid) {
		showError(username, password, passwordConfirmation)
		event.preventDefault()
	} else {
		if (!isPopupOpen) {
			eraseFieldValue()
		} else {
			updateUser(event, oldUsername, newUsername, oldPass, newPass, newPassConfirmation)
		}
	}
}

function handleUsernameChange(event) {
	let username = document.getElementById('usernameField')
	if (username.validity.typeMismatch) {
		username.setCustomValidity("Entrez un nom d'utilisateur")
		username.reportValidity()
	} else {
		username.setCustomValidity('')
		newUsername = event.target.value
	}
}

function handlePasswordChange(event) {
	oldPass = event.target.value
}
function handleNewPasswordChange(event) {
	let password = document.getElementById('passwordField')

	if (password.validity.typeMismatch) {
		password.setCustomValidity('Entrez un mot de passe contenant 8 charactères')
		password.reportValidity()
	} else {
		password.setCustomValidity('')
		newPass = event.target.value
	}
}
function handleNewConfirmationPasswordChange(event) {
	let passwordConfirmation = document.getElementById('passwordConfirmationField')

	if (passwordConfirmation.validity.typeMismatch) {
		passwordConfirmation.setCustomValidity('Entrez un mot de passe contenant 8 charactères')
		passwordConfirmation.reportValidity()
	} else {
		passwordConfirmation.setCustomValidity('')
		newPassConfirmation = event.target.value
	}
}

export default function ProfilePopup(props) {
	const [Modal, open, close, isOpen] = useModal('header', {
		preventScroll: true,
		closeOnOverlayClick: true
	})

	if (!isOpen) {
		eraseFieldValue()
	}

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
							handleSubmit(event, props.username, isOpen)
						}}
					>
						<h1>Informations</h1>
						<div id="wrong">Le nom que vous désirez entrer est déjà utilisé</div>
						<div id="wrong-2">Le nom que vous désirez entrer est déjà utilisé</div>
						<label>Nom d&apos;utilisateur</label>
						<input
							id="usernameField"
							type="text"
							defaultValue={props.username}
							onChange={handleUsernameChange}
							minLength="4"
							autoComplete="off"
						/>
						<hr className="form-separator"></hr>
						<label>Courriel</label>
						<input type="email" defaultValue={props.email} disabled />
						<hr className="form-separator"></hr>
						<label>Entrez votre ancien mot de passe ainsi que le nouveau</label>
						<input
							type="password"
							placeholder="Ancien mot de passe"
							onChange={handlePasswordChange}
						></input>
						<input
							id="passwordField"
							type="password"
							placeholder="Nouveau mot de passe"
							onChange={handleNewPasswordChange}
							minLength="8"
						></input>
						<input
							id="passwordConfirmationField"
							type="password"
							placeholder="Confirmation nouveau mot de passe"
							onChange={handleNewConfirmationPasswordChange}
							minLength="8"
						></input>
						<input type="submit" value="Modifier" />
						<button type="button" onClick={close} id="cancel-edit">
							Annuler
						</button>
					</form>
					<a className="link" onClick={deleteUser}>
						Supprimer mon compte
					</a>
				</div>
			</Modal>
		</div>
	)
}
