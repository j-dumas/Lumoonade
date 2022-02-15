import React, { useState, useEffect } from 'react';
import Icons from './Icons';

function SimplestItemView(props) {

    console.log(props.data)

    function handleClick() {
        props.command(props.slug)
        console.log('test')
    }

    return (
        <>
            <div className={'dynamic-list-item row bg' + props.bg}>
                <p>{props.slug}</p>
                <p></p>
                <div className='row'>
                    <p></p>
                    <p></p>
                </div>
                <div onClick={handleClick}>
                    <Icons.Times/>
                </div>
            </div>
        </>
    )
}

export default SimplestItemView;
