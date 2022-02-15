import React from 'react'
import Icons from './Icons';
import { deleteWatch } from '../services/UserService';

export default function ProfileAlertsComponent(props) {

    function getSign(parameter){
        if(parameter === 'lte'){
            return (<span>&#8804;</span>)
        }
        else if (parameter === 'gte'){
            return (<span>&#8805;</span>)
        }
    }

    function handleEdit(event){
        console.log(props.alert._id)
        event.preventDefault()
    }

    async function handleDelete(event){
        await deleteWatch(props.alert._id)
        props.onDataChange()
    }

  return (
    <div className='row alert-card'>
        <div id='alert-slug'>
            {props.alert.slug}
        </div>
        <div>
            {getSign(props.alert.parameter)}
        </div>
        <div id='alert-target'>
            {props.alert.target}&#36;
        </div>
        <div className='row'>
            <button className="icon-button" onClick={handleEdit}>
                <Icons.Edit  id="icon"/>
            </button>
            <button className="icon-button" onClick={(event) => handleDelete(event)}>
                <Icons.Trash  id="icon"/>
            </button>
        </div>
    </div>
  )
}
