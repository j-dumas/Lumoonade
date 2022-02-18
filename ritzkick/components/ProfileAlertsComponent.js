import React, {useState} from 'react'
import Icons from './Icons';
import { deleteWatch } from '../services/UserService';
import { Snackbar, Alert } from '@mui/material';

export default function ProfileAlertsComponent(props) {
    const [openStatus, setOpen] = useState(false)

    function handleClose(event, reason){
        if (reason === 'clickaway') {
            return
        }
      
        setOpen(false)
    }

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
        event.preventDefault()
        await deleteWatch(props.alert._id)
        props.onDataChange()
        setOpen(true)

    }

  return (
      <div>
        <Snackbar open={openStatus} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                Alerte supprimée !
            </Alert>
        </Snackbar>

        <div className='row alert-card'>
            <div id='alert-slug' className='alert-card-item'>
                {props.alert.slug}
            </div>
            <div className='alert-card-item'>
                {50000}&#36; {/* RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPPPPPPHY WEEEEEB SOOOOOOCKET ON VEUT LE PRIX */}
            </div>
            <div className='alert-card-item'>
                {getSign(props.alert.parameter)}
            </div>
            <div id='alert-target' className='alert-card-item'>
                {props.alert.target}&#36;
            </div>
            <button className="alert-card-item" onClick={(event) => handleDelete(event)}>
                <Icons.Trash  id="icon"/>
            </button>
        </div>
      </div>
  )
}