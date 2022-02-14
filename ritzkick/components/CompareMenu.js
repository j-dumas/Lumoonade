import React, { useState, useEffect } from 'react';
import Functions from '../services/CryptoService';
import ButtonFavorite from '../components/ButtonFavorite';

function CompareMenu(props) {
	function format(x) {
		return Number.parseFloat(x).toFixed(2);
	}

    //const [data, setData] = useState(props.firstData)
    useEffect(async () => {
        /*
        props.socket.on('data', (data) => {
            setData(data)
        })
        if (props.socket) return () => socket.disconnect();
        */
    }, [])

    return (
        <>
            <div className='column detailed-informations detailed-div'>
                <div className='detailed-div-menu row space-between'>
                    <label className='detailed-div-title'>Comparing</label>
                    <div>
                        <select name="" id=""  className='detailed-chart-options-select'>
                            <option value="price">Price</option>
                            <option value="efficiency">Efficiency</option>
                            <option value="volume">Volume</option>
                            <option value="marketCap">Market cap</option>
                        </select>
                        <p className='detailed-div-title'>$ = CAD$</p>
                    </div>
                </div>
                <div className='row space-between detailed-div-item'>
                    <p className='detailed-div-item-label'>With</p>
                </div>
                
            </div>
        </>
    )
}

export default CompareMenu;
