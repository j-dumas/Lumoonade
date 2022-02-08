import React, { useState, useCallback } from 'react';
import Icons from './Icons';
import { useModal } from 'react-hooks-use-modal';
import Link from 'next/link';

let newUsername = ''
let oldPass = ''
let newPass = ''
let newPassConfirmation = ''

function handleSubmit(oldUsername){
    //api call

    /*
    !   Paremetre du body dans l'api
        new username
        old password
        new password


        todo: Si newPass et newPassConfirmation sont identique, validation sur newPass et confirmation, 
    */
    console.log(newUsername + ' ' + oldPass + ' ' + newPass + ' ' + newPassConfirmation)
}

function handleUsernameChange(event){
    newUsername = event.target.value
    console.log(newUsername)
}

function handlePasswordChange(event){
    oldPass = event.target.value
    console.log(oldPass)
}
function handleNewPasswordChange(event){
    newPass = event.target.value
    console.log(newPass)
}
function handleNewConfirmationPasswordChange(event) {
    newPassConfirmation = event.target.value
    console.log(newPassConfirmation)
}


export default function ProfilePopup(props){
    const [Modal, open, close] = useModal('header', {
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
                    <form id='update-form' onSubmit={handleSubmit(props.username)}>
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
                        <input type="submit" value="Modifier" /> 
                        <button onClick={close} id="cancel-edit">Annuler</button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}
