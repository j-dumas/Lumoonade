import React, { useState, useCallback } from 'react';
import Icons from './Icons';
import { useModal } from 'react-hooks-use-modal';
import Link from 'next/link';

let newUsername = ''

function handleSubmit(oldUsername){
    //api call
    console.log(newUsername)
}

function handleChange(event){
    newUsername = event.target.value
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
                    <form id='update-form' onSubmit={handleSubmit(props.username)}>
                        <h1>Informations</h1>
                        <label>Nom d'utilisateur</label>
                        <input type="text" defaultValue={props.username} onChange={handleChange} />
                        <label>Courriel</label>
                        <input type="email" defaultValue={props.email} disabled/>
                        <label>Entrez votre ancien mot de passe ainsi que le nouveau</label>
                        <input type="password" placeholder='Ancien mot de passe'></input>
                        <input type="password" placeholder='Nouveau mot de passe'></input>
                        <input type="password" placeholder='Confirmation nouveau mot de passe'></input>
                        <input type="submit" value="Modifier" /> 
                        <button onClick={close} id="cancel-edit">Annuler</button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}
