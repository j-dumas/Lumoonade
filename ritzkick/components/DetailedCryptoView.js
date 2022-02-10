import React, {useState, useEffect} from 'react'
import Icons from './Icons'
import Functions, {
    GetCryptocurrencyInformationsBySlug,
    GetTopPopularCryptocurrencies,
    GetTopEfficientCryptocurrencies
} from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'
import DetailedInformations from '../components/DetailedInformations'
import DetailedChart from './DetailedChart'

const io = require('socket.io-client')

function DetailedCryptoView(props) {
    // Validation:
    if (!props.slug || !props.currency) return <div>Impossible action.</div>

    
    const [socket, setSocket] = useState(io('http://localhost:3000/', {
        auth: {
            token: [props.slug+'-'+props.currency] // ex: 'BTC-CAD'
        }
    }))
    useEffect(()=> {
        socket.on('welcome', () => {
            console.log('welcome')
        })

        if (socket) return () => socket.disconnect();
    }, [])

    return (
        <>
            <div className='detailed-crypto-view column'>
                <div className='detailed-menu space-between row h-center'>
                    <div className='row h-center'>
                        <img className='simple-crypto-view-logo' src="ETH.svg" alt="" />
                        <h1 className='detailed-menu-title'>Ethereum</h1>
                        <p className='detailed-menu-subtitle'>ETH</p>
                        <a className='detailed-chart-legend-button-special' href='test'>Compare</a>
                        
                    </div>
                    <div className='detailed-menu-actions row h-center'>
                        <ButtonFavorite/>
                        <a href="" className=''><Icons.Bell/></a>
                        <a href="" className='detailed-menu-actions-icon'><Icons.ArrowUp/></a>
                        <a href="" className='detailed-menu-actions-icon'><Icons.ArrowDown/></a>
                        <a href="" className='detailed-menu-actions-icon'><Icons.Exange/></a>   
                    </div>
                </div>
                <div className='row space-between'>
                    <DetailedInformations socket={socket} slug={"ETH-CAD"}/>
                    <DetailedChart slug="ETH-CAD"/>
                </div>
            </div>
        </>
    )
}

export default DetailedCryptoView;

/* 
                    <div className='row detailed-crypto-div left h-center'>
                        <p className='detailed-crypto-div-title'>Current currency:</p>
                        <select onChange={handleChangeCurrency} value={currency} name="currency">
                            <optgroup label="Currency">
                                <option value="USD">USD</option>
                                <option value="CAD">CAD</option>
                                <option value="EURO">EURO</option>
                            </optgroup>
                        </select>
                    </div>
*/