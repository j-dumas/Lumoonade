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
    const [datas, setDatas] = useState([])

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

    useEffect(() => {
        if (!socket) return
        socket.on('data', (data) => {
			setDatas(data)
		})
		if (socket) return () => socket.disconnect()
    }, [])

    return (
        !firstData || !socket? <p>Loading...</p>:
        <div className='detailed-crypto-view column'>
            <div className="detailed-menu space-between row h-center">
			    <div className="row h-center detailed-menu-info">
				    <h1 className="detailed-menu-title">Compare</h1>
			    </div>
		    </div>
            <div className='row space-between'>
                <CompareMenu socket={socket} slugs={slugs} currency={props.currency} firstData={firstData}/>
                <DetailedChart socket={socket} slug={slug}/>
            </div>
        </div>
    )
}
export default CompareView