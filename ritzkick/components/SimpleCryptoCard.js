import React, {useState, useEffect} from 'react'
import SimpleChart from './SimpleChart'

function SimpleCryptoCard(props) {
    function format(x) {
        return Number.parseFloat(x).toFixed(2);
    }

    const [data, setData] = useState(props.data)
    const change = format(((data.price - data.value[0])/data.value[0])*100)

    return (
        <>
            <a href={'assets/'+data.abbreviation} className='simple-crypto-card column h-center'>
                <div className='row h-center'>
                    <img className='simple-crypto-view-logo' src={data.abbreviation + ".svg"} alt="" />   
                    <p className='simple-crypto-name'>{data.name}</p>
                    <p className='simple-crypto-abbreviation'>{data.abbreviation}</p>
                </div>
                <div className='row'>
                    <p className='simple-crypto-view-item simple-crypto-price'>{data.price} $</p>
                    <p className={change>0?'simple-crypto-view-item simple-crypto-change c-green': change==0?'simple-crypto-view-item simple-crypto-change c-white':'simple-crypto-view-item simple-crypto-change c-red'}>{change} %</p>
                </div>
                <SimpleChart data={data}/>
            </a>
        </>
    )
}

export default SimpleCryptoCard;