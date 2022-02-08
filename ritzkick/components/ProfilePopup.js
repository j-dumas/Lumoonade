import React, { useState, useCallback } from 'react';
import Icons from './Icons';
import { useModal } from 'react-hooks-use-modal';

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


        todo: Reset les champs après chaque annulation
    */
    if(oldUsername !== undefined){
        if(newUsername !== oldUsername && newUsername !== ''){
            if(newPass === newPassConfirmation && oldPass !== ''){
                console.log('name and password wants to be changed')
            }
            else{
                console.log('Name wants to be changed')
            }
        }
        else if(newPass == newPassConfirmation && oldPass != ''){
            console.log('Password wants to be changed')
        }
        else{
            console.log('Nothing wants to be changed')
        }
    }
    
}

function eraseFieldValue(){
    newUsername = ''
    oldPass = ''
    newPass = ''
    newPassConfirmation = ''
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
                    <form id='update-form' onClick={handleSubmit(props.username)}>
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
                        <button type='button' onClick={close} id="cancel-edit">Annuler</button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}
