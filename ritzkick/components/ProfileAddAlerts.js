import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal';
import Icons from './Icons';
import { addWatch } from '../services/UserService';
import ProfileSearchBar from './ProfileSearchBar';

const data = [
    {
        slug: 'btc',
        name: 'Bitcoin',
    },
    {
        slug: 'eth',
        name: 'Etherium'
    }
]



export default function ProfileAddAlerts(props) {
    const [state, setState] = useState({slug: data[0].slug, target: 0, parameter: 'lte'})
    const [options, setOptions] = useState(data)

    const [Modal, open, close, isOpen] = useModal('alerts-header', {
		preventScroll: true,
		closeOnOverlayClick: true
	})

    useEffect(() => {
        if(!isOpen){
            //Reset chaque fois que le popup est fermé
            setState({slug: data[0].slug, target: 0, parameter: 'lte'})
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

    function onInputChange(event) {
        setOptions(data.filter((option) => option.slug.includes(event.target.value)))
    }

    async function handleSubmit(event){
        event.preventDefault()
        await addWatch(state)
        await props.onDataChange()
        close()
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
                    {/* <select onChange={handleAssetChange}>
                        {
                            data.map(element =>(
                                <option key={element.slug} value={element.slug}>{element.name}</option>
                            ))
                        }
                    </select> */}
                    <ProfileSearchBar  data={options} onInputChange={onInputChange}/>
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
