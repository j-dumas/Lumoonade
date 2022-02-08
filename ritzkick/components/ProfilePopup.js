import React, { useState, useCallback } from 'react';
import Icons from './Icons';
import { useModal } from 'react-hooks-use-modal';
import { deleteUser, updateUser } from '../services/UserService'

let newUsername = ''
let oldPass = ''
let newPass = ''
let newPassConfirmation = ''


function eraseFieldValue(){
    newUsername = ''
    oldPass = ''
    newPass = ''
    newPassConfirmation = ''
}

async function handleSubmit(event, oldUsername, isPopupOpen){
    if(!isPopupOpen){
        eraseFieldValue()
    }
    else{
        updateUser(event, oldUsername, newUsername, oldPass, newPass, newPassConfirmation)
    }
}


function handleUsernameChange(event){
    newUsername = event.target.value
}

function handlePasswordChange(event){
    oldPass = event.target.value
}
function handleNewPasswordChange(event){
    newPass = event.target.value
}
function handleNewConfirmationPasswordChange(event) {
    newPassConfirmation = event.target.value
}


export default function ProfilePopup(props){
    const [Modal, open, close, isOpen] = useModal('header', {
        preventScroll: true,
        closeOnOverlayClick: true
    })

    return (
        <div>
            <button id="icon-button" onClick={open}>
                <Icons.Edit  id="icon"/>
            </button>
            <Modal>
                <div className='edit-popup'>
                    <form id='update-form' onClick={() => {handleSubmit(event, props.username, isOpen)}}>
                        <h1>Informations</h1>
                        <label>Nom d'utilisateur</label>
                        <input type="text" defaultValue={props.username} onChange={handleUsernameChange} />
                        <hr className="form-separator"></hr>
                        <label>Courriel</label>
                        <input type="email" defaultValue={props.email} disabled/>
                        <hr className="form-separator"></hr>
                        <label>Entrez votre ancien mot de passe ainsi que le nouveau</label>
                        <input type="password" placeholder='Ancien mot de passe' onChange={handlePasswordChange}></input>
                        <input type="password" placeholder='Nouveau mot de passe' onChange={handleNewPasswordChange}></input>
                        <input type="password" placeholder='Confirmation nouveau mot de passe' onChange={handleNewConfirmationPasswordChange}></input>
                        <input type="submit" value="Modifier"/> 
                        <button type='button' onClick={close} id="cancel-edit">Annuler</button>
                    </form>
                    <a className='link' onClick={deleteUser}>Supprimer mon compte</a>
                </div>
            </Modal>
        </div>
    )
}
