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
import { useRouter } from 'next/router'

const io = require('socket.io-client')

function CompareView(props) {
	// Validation:
	if (!props.currency) return <div>Impossible action.</div>;

    const router = useRouter()
    const [slug, setSlug] = useState('BTC' + '-' + props.currency)
    const [slugs, setSlugs] = useState(getFirstCompareList())
    const [firstData, setFirstData] = useState()
    const [socket, setSocket] = useState()
    const [datas, setDatas] = useState([])

    const [dateRange, setDateRange] = useState('5d')
    const [interval, setInterval] = useState('15m')
    
    function getFirstCompareList() {
        let paramsString = router.asPath.toString().split('/compare?assets=')[1]
        if (!paramsString) return []
        let params = paramsString.split('-')
        params.map((param, i) => {
            params[i] = param + '-' + props.currency
        })
        return params
    }

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