import React, {useState, useEffect} from 'react'
import SimpleChart from './SimpleChart'

function SimpleCryptoView(props) {
    function format(x) {
        return Number.parseFloat(x).toFixed(2);
    }

    const [data, setData] = useState(props.data)

    const change = format(((data.price - data.value[0])/data.value[0])*100)

    return (
        <>
            <a href={'assets/'+data.abbreviation} className='simple-crypto-view row h-center'>
                <div className='simple-crypto-view-item row left h-center'>
                    <img className='simple-crypto-view-logo' src={data.abbreviation + ".svg"} alt="" />
                    <div className='column simple-crypto-names'>
                        <p className='simple-crypto-name'>{data.name}</p>
                        <p className='simple-crypto-abbreviation'>{data.abbreviation}</p>
                    </div>
                </div>
                <p className='simple-crypto-view-item simple-crypto-price'>{data.price}</p>
                <p className={change>0?'simple-crypto-view-item simple-crypto-change c-green': change==0?'simple-crypto-view-item simple-crypto-change c-white':'simple-crypto-view-item simple-crypto-change c-red'}>{change} %</p>
                <SimpleChart data={data}/>
            </a>
        </>
    )
}

export default SimpleCryptoView;