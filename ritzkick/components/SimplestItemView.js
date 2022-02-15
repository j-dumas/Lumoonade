import React, { useState, useEffect } from 'react';
import GetColorBySlug from '../utils/color'
import Icons from './Icons';

function SimplestItemView(props) {

    const [color, setColor] = useState(GetColorBySlug(props.slug))

    function handleClick() {
        props.command(props.slug)
        console.log('test')
    }

    const divStyle = {
        backgroundColor: color,
    };

    return (
        <>
            <div className='dynamic-list-item row' style={divStyle}>
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
