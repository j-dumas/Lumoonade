import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal';
import Icons from './Icons';
import { addWatch } from '../services/UserService';


export default function ProfileAddAlerts() {
    const [state, setState] = useState({slug: 'btc', target: 0, parameter: 'lte'})

    const [Modal, open, close, isOpen] = useModal('alerts-header', {
        preventScroll: true,
        closeOnOverlayClick: true
    })

    useEffect(() => {
        if(!isOpen){
            //Reset chaque fois que le popup est fermé
            setState({slug: 'btc', target: 0, parameter: 'lte'})
        }
    }, [isOpen])

    function handleAssetChange(event){
        setState({...state, slug: event.target.value})
    }

    function handleTargetChange(event){
        setState({...state, target: event.target.value})
    }
    
    function handleSymbolChange(event) {
        setState({...state, parameter: event.target.value})
    }

    function handleSubmit(event){
        addWatch(state)
        event.preventDefault()
    }

  return (
    <div>
        <button className='icon-button transform' id='rotate-button' onClick={open}>
            <Icons.Times/>
        </button>
        <Modal>
            <div className='edit-popup'>
                <h1>Ajouter une alerte</h1>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <select onChange={handleAssetChange} >
                        <option value="btc">BitCoin</option>
                        <option value="eth">Etherium</option>
                    </select>
                    <input type="number" placeholder='Valeur' onChange={handleTargetChange} required min="1"></input> {/*max="market cap"*/}
                    <select onChange={handleSymbolChange}>
                        <option value="lte">Moins que la valeur</option>
                        <option value="gte">Plus que la valeur</option>
                    </select>
                    <input type="submit" value="Ajouter"></input>
                    <button type='button' onClick={close} id="cancel-edit">Annuler</button>
                </form>
            </div>
        </Modal>
        
    </div>
  )
}
