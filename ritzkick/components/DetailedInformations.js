import React, {useState, useEffect} from 'react'
import Functions from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'


function DetailedInformations(props) {
    const [data, setData] = useState()
    useEffect(() => {
        props.socket.on('priceChange', (data) => setData([data]))
        if (props.socket) return () => socket.disconnect();
        
        //  setTimeout(async () => {setData(await Functions.GetCryptocurrencyInformationsBySlug(props.slug, '', ''))}, 1000)
    }, [])

    return (
        !data ? <>Loading...</> :
        <>
            <div className='column detailed-div'>
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