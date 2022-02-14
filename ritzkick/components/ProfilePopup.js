import React, { useEffect, useState } from 'react';
import Icons from './Icons';
import { useModal } from 'react-hooks-use-modal';
import { deleteUser, updateUser } from '../services/UserService'
import { useForm } from './hooks/useForm';

const newUsername = 'newUsername'
const oldPass = 'oldPass'
const newPass = 'newPass'
const newPassConfirmation = 'newPassConfirmation'

export default function ProfilePopup(props){
    const [Modal, open, close, isOpen] = useModal('header', {
        preventScroll: true,
        closeOnOverlayClick: false
    })
    const [values, handleChange, resetValues] = useForm({newUsername: '', oldPass: '', newPass: '', newPassConfirmation: ''})

    function eraseFieldValue(){
        resetValues()
    }

    async function handleSubmit(event){
        if(!isOpen){
            eraseFieldValue()
        }
        else{
            updateUser(event, props.username, values.newUsername, values.oldPass, values.newPass, values.newPassConfirmation)        
        }
    }

    useEffect(() => {
        if(!isOpen){
            eraseFieldValue()
        }
    }, [isOpen])

    return (
        <div>
            <button className="icon-button" onClick={open}>
                <Icons.Edit  id="icon"/>
            </button>
            <Modal>
                <div className='edit-popup'>
                    <form id='update-form' onSubmit={(event) => {handleSubmit(event)}}>
                        <h1>Informations</h1>
                        <div id='wrong'>Le nom que vous désirez entrer est déjà utilisé</div>
                        <div id='wrong-2'>Le nom que vous désirez entrer est déjà utilisé</div>
                        <label>Nom d'utilisateur</label>
                        <input name={newUsername} id='usernameField' type="text" defaultValue={props.username} onChange={handleChange} minLength="4" autoComplete="off"/>
                        <hr className="form-separator"></hr>
                        <label>Courriel</label>
                        <input name='email' type="email" defaultValue={props.email} disabled/>
                        <hr className="form-separator"></hr>
                        <label>Entrez votre ancien mot de passe ainsi que le nouveau</label>
                        <input name={oldPass} type="password" placeholder='Ancien mot de passe' onChange={handleChange}></input>
                        <input name={newPass} id="passwordField" type="password" placeholder='Nouveau mot de passe' onChange={handleChange} minLength="8"></input>
                        <input name={newPassConfirmation} id="passwordConfirmationField" type="password" placeholder='Confirmation nouveau mot de passe' onChange={handleChange} minLength="8"></input>
                        <input type="submit" value="Modifier"/> 
                        <button type='button' onClick={close} id="cancel-edit">Annuler</button>
                    </form>
                    <a className='link' onClick={deleteUser}>Supprimer mon compte</a>
                </div>
            </Modal>
        </div>
    )
}
