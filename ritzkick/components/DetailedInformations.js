import React, {useState, useEffect} from 'react'
import GetCryptoData from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'

function DetailedInformations(props) {
    const [data, setData] = useState([{}]) //props.data

    useEffect(async ()=> {
        setTimeout(async () => {
            setData(await GetCryptoData(props.slug, '', ''))
            console.log('test')
            console.log(data)
        }, 1000)
    })

    return (
        <>
            <div className='column detailed-crypto-div'>
                <div className='row h-center'>       
                    <img className='simple-crypto-view-logo' src={data[0].fromCurrency + ".svg"} alt="" />
                    <div className='column v-center'>
                        <p className='simple-crypto-name'>{data[0].fromCurrency}</p>
                        <p className='simple-crypto-abbreviation'>{data[0].fromCurrency}</p>
                    </div>
                    <ButtonFavorite/>
                    <a href="" className='button'>Compare</a>
                </div>
                </div>  
                <div className='column detailed-crypto-div'>
                    <p className='detailed-crypto-div-title'>Detailed informations:</p>
                    <div className='row detailed-crypto-item'>
                        <p className='detailed-crypto-item-title'>Price</p>
                        <p className='detailed-crypto-item-value'>{data[0].regularMarketPrice}</p>
                    </div>
                    <div className='row detailed-crypto-item'>
                        <p className='detailed-crypto-item-title'>24h Change %</p>
                        <p className='detailed-crypto-item-value'>{data[0].regularMarketChangePercent} %</p>
                    </div>
                    <div className='row detailed-crypto-item'>
                        <p className='detailed-crypto-item-title'>24h Change $</p>
                        <p className='detailed-crypto-item-value'>{data[0].regularMarketChange} $</p>
                    </div>
                    <div className='row detailed-crypto-item'>
                        <p className='detailed-crypto-item-title'>Market cap</p>
                        <p className='detailed-crypto-item-value'>{data[0].marketCap}</p>
                    </div>
                    <div className='row detailed-crypto-item'>
                        <p className='detailed-crypto-item-title'>24h Volume $</p>
                        <p className='detailed-crypto-item-value'>{data[0].volume24Hr} $</p>
                    </div>
                    <div className='row detailed-crypto-item'>
                        <p className='detailed-crypto-item-title'>Regular volume</p>
                        <p className='detailed-crypto-item-value'>{data[0].regularMarketVolume}</p>
                    </div>                     
            </div>
        </>
    )
}
// 
export default DetailedInformations;