import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal';
import Icons from './Icons';


export default function ProfileAddAlerts() {
    const [state, setState] = useState({asset: 'BTC', target: 0, symbol: false})

    const [Modal, open, close, isOpen] = useModal('alerts-header', {
        preventScroll: true,
        closeOnOverlayClick: true
    })

    useEffect(() => {
        if(!isOpen){
            setState({asset: 'BTC', target: 0, symbol: false})
        }
    }, [isOpen])

    function handleAssetChange(event){
        setState({asset: event.target.value, target: state.target, symbol: state.symbol})
    }

    function handleTargetChange(event){
        setState({asset: state.asset, target: event.target.value, symbol: state.symbol})
    }
    
    function handleSymbolChange(event) {
        let symbol = null
        if(event.target.value === "lte"){
            symbol = false
        }
        else if(event.target.value === "gte"){
            symbol = true
        }
        else{
            alert("something went wrong")
        }
        setState({asset: state.asset, target: state.target, symbol: symbol})
    }

    function handleSubmit(){
        //Api call to add
        console.log(state)
    }

  return (
    <div>
        <button className='icon-button transform' id='rotate-button' onClick={open}>
            <Icons.Times/>
        </button>
        <Modal>
            <div className='edit-popup'>
                <h1>Ajouter une alerte</h1>
                <form onSubmit={handleSubmit}>
                    <select onChange={handleAssetChange} >
                        <option value="BTC">BitCoin</option>
                        <option value="ETH">Etherium</option>
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
