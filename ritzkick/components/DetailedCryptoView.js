import React, {useState, useEffect} from 'react'
import Icons from './Icons'
import Functions, {
    GetCryptocurrencyInformationsBySlug,
    GetTopPopularCryptocurrencies,
    GetTopEfficientCryptocurrencies
} from '../services/CryptoService'
import dynamic from 'next/dynamic'
import ButtonFavorite from '../components/ButtonFavorite'
import ButtonLegend from '../components/ButtonLegend'
import DetailedInformations from '../components/DetailedInformations'

const DetailedChart = dynamic(
    () => {
        return import('../components/DetailedChart')
    },
    {ssr:false}
)

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
        //const socket = 
        //socket.disconnect()
        socket.on('welcome', () => {
            console.log('welcome')
        })

        if (socket) return () => socket.disconnect();
    }, [])

    const [showPrice, setShowPrice] = useState(true)
    const [showChange, setShowChange] = useState(false)
    const [showVolume, setShowVolume] = useState(false)
    const [dateRange, setDateRange] = useState("5D")
    const [interval, setInterval] = useState("15mins")
    const [currency, setCurrency] = useState("USD")

    function getShowPrice(value) {
        setShowPrice(value)
        console.log(showPrice)
        handleChartChange()
    }
    function getShowChange(value) {
        setShowChange(value)
        console.log(showChange)
        handleChartChange()
    }
    function getShowVolume(value) {
        setShowVolume(value)
        console.log(showVolume)

        handleChartChange()
    }

    function handleChangeDateRange(value) {
        setDateRange(value.target.value)
        handleChartChange()
    }
    function handleChangeInterval(value) {
        setInterval(value.target.value)
        handleChartChange()
    }
    function handleChangeCurrency(value) {
        setCurrency(value.target.value)
        handleChartChange()
    }

    function handleChartChange() {
        // Get function for all parameters
    }

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
                    <DetailedInformations socket={socket}/>
                    <div className='detailed-chart detailed-div'>
                        <div className='detailed-div-menu row h-center space-between'>
                            <div className='row detailed-chart-legend left h-center'>
                                <ButtonLegend sendData={getShowPrice} value={showPrice} name="Price" backgroundColor="var(--main-color)"/>
                                <ButtonLegend sendData={getShowChange} value={showChange} name="24h change" backgroundColor="orange"/>
                                <ButtonLegend sendData={getShowVolume} value={showVolume} name="24h volume" backgroundColor="red"/>
                            </div>
                            <div className='row detailed-chart-options left'>
                                <div className='row h-center'>
                                    <label htmlFor="interval" className='detailed-div-title'>Date range</label>
                                    <select onChange={handleChangeDateRange} value={dateRange} className='detailed-chart-options-select' name="daterange">
                                        <optgroup label="Date Range">
                                            <option value="1D">1 D</option>
                                            <option value="5D">5 D</option>
                                            <option value="1M">1 M</option>
                                            <option value="3M">3 M</option>
                                            <option value="6M">6 M</option>
                                            <option value="1Y">1 Y</option>
                                            <option value="MAX">MAX</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className='row h-center'>
                                    <label htmlFor="interval" className='detailed-div-title'>Interval</label>
                                    <select onChange={handleChangeInterval} value={interval} className='detailed-chart-options-select' name="interval">
                                        <optgroup label="Interval">
                                            <option value="1min">1 min</option>
                                            <option value="2mins">2 mins</option>
                                            <option value="5mins">5 mins</option>
                                            <option value="15mins">15 mins</option>
                                            <option value="30mins">30 mins</option>
                                            <option value="1hour">1 hour</option>
                                            <option value="4hours">4 hours</option>
                                            <option value="1day">1 day</option>
                                            <option value="1week">1 week</option>
                                            <option value="1month">1 month</option>
                                            <option value="1year">1 year</option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DetailedChart/>
                    </div>
                </div>
            </div>
        </>
    )
}
// detailed-crypto-div
// <DetailedChart/>
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