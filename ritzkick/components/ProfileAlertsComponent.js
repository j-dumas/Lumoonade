import React from 'react'

export default function ProfileAlertsComponent(props) {

    function getSign(parameter){
        if(parameter === 'lte'){
            return (<span>&#8804;</span>)
        }
        else if (parameter === 'gte'){
            return (<span>&#8805;</span>)
        }
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
    </div>
  )
}
