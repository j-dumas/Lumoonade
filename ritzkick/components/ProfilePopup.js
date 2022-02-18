import React, { useEffect, useState } from 'react'
import Icons from './Icons'
import { useModal } from 'react-hooks-use-modal'
import { deleteUser, updateUser } from '../services/UserService'
import { useForm } from './hooks/useForm'

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

	function eraseFieldValue() {
		resetValues()
	}

	function deleteAuthUser() {
		if (confirm('Êtes-vous sur de vouloir supprimer votre compte?')) {
			deleteUser()
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
						<h1>Informations</h1>
						<div className="wrong" id="wrong-name">
							Le nom que vous désirez entrer est déjà utilisé
						</div>
						<label>Nom d&apos;utilisateur</label>
						<input
							name={newUsername}
							id="usernameField"
							type="text"
							defaultValue={props.username}
							onChange={handleChange}
							minLength="4"
							autoComplete="off"
						/>
						<hr className="form-separator"></hr>
						<label>Courriel</label>
						<input name="email" type="email" defaultValue={props.email} disabled />
						<hr className="form-separator"></hr>
						<label>Entrez votre ancien mot de passe ainsi que le nouveau</label>
						<div className="wrong" id="wrong-password">
							Veuillez vérifier si tous les champs ci dessous concorde bien
						</div>
						<input
							name={oldPass}
							type="password"
							placeholder="Ancien mot de passe"
							onChange={handleChange}
						></input>
						<input
							name={newPass}
							id="passwordField"
							type="password"
							placeholder="Nouveau mot de passe"
							onChange={handleChange}
							minLength="8"
						></input>
						<input
							name={newPassConfirmation}
							id="passwordConfirmationField"
							type="password"
							placeholder="Confirmation nouveau mot de passe"
							onChange={handleChange}
							minLength="8"
						></input>
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
