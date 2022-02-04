import React, { useState, useCallback } from 'react';
import Icons from './Icons';
import { useModal } from 'react-hooks-use-modal';


export default function ProfilePopup(){
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
                <div id='edit-popup'>
                    <h1>Title</h1>
                    <button onClick={close}>close</button>
                </div>
            </Modal>
        </div>
    )
}
