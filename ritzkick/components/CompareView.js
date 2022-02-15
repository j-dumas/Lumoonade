import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Icons from './Icons'
import Functions, {
	GetCryptocurrencyInformationsBySlug,
	GetTopPopularCryptocurrencies,
	GetTopEfficientCryptocurrencies
} from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'
import DetailedInformations from '../components/DetailedInformations'
import DetailedChart from './DetailedChart'
import CompareMenu from './CompareMenu'

const io = require('socket.io-client')

function CompareView(props) {
	// Validation:
	if (!props.currency) return <div>Impossible action.</div>;

    const [slug, setSlug] = useState('bnb' + '-' + props.currency)
    const [slugs, setSlugs] = useState(['BNB' + '-' + props.currency, 'LTC' + '-' + props.currency])
    const [firstData, setFirstData] = useState()
    const [socket, setSocket] = useState()

    const [dateRange, setDateRange] = useState('5d')
    const [interval, setInterval] = useState('15m')

    useEffect(async () => {
        setFirstData(await Functions.GetCryptocurrencyInformationsBySlug(slug))
       
        setSocket(io('http://localhost:3000/', {
            auth: {
                rooms: ['general', `graph-${dateRange}-${interval}`],
                query: slugs,
                graph: true
            }
        }))
    }, [slugs])

    return (
        !firstData || !socket? <p>Loading...</p>:
        <div className='detailed-crypto-view column'>
            <div className='row space-between'>
                <CompareMenu socket={socket} slugs={slugs} currency={props.currency} firstData={firstData}/>
                <DetailedChart socket={socket} slug={slug}/>
            </div>
        </div>
    )
}

export default CompareView
// <DetailedInformations socket={socket} slug={slug} firstData={firstData}/>
