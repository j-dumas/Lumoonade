import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Icons from './Icons'
import Functions, {
	GetCryptocurrencyInformationsBySlug,
	GetTopPopularCryptocurrencies,
	GetTopEfficientCryptocurrencies
} from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'
import DetailedInformationsDashboard from '../components/DetailedInformationsDashboard'
import DetailedChart from './DetailedChart'
import CompareMenu from './CompareMenu'
import { useRouter } from 'next/router'

const io = require('socket.io-client')

function CompareView(props) {
	// Validation:
	if (!props.currency) return <div>Impossible action.</div>;

    const router = useRouter()
    const [slug, setSlug] = useState('BTC' + '-' + props.currency)
    const [firstData, setFirstData] = useState()
    const [compareList, setCompareList] = useState(getFirstCompareList())

    const [dateRange, setDateRange] = useState('5d')
    const [interval, setInterval] = useState('15m')
    const [socket] = useState(io('http://localhost:3000/', {
        auth: {
            rooms: ['general', `graph-${dateRange}-${interval}`],
            query: compareList,
            graph: true
        }
    }))

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
        // TODO: Fonction à changer pour retourner plusieurs datas.
        setFirstData(await Functions.GetCryptocurrencyInformationsBySlug(slug))
    }, [compareList])

    return (
        !firstData || !socket? <p>Loading...</p>:
        <div className='detailed-crypto-view column'>
            <div className="detailed-menu space-between row h-center">
			    <div className="row h-center detailed-menu-info">
				    <h1 className="detailed-menu-title">Compare</h1>
			    </div>
		    </div>
            <div className='row space-between'>
                <div className='column'>
                    <CompareMenu socket={socket} compareList={compareList} setCompareList={setCompareList} currency={props.currency}/>
                    <div className='column detailed-informations detailed-div max-width'>
                        <div className='detailed-div-menu row space-between'>
                            <p>Titre</p>
                            <p>Lorem</p>
                        </div>
                    </div>
                </div>
                <DetailedChart socket={socket} slug={slug}/>
            </div>
            <DetailedInformationsDashboard socket={socket} currency={props.currency} name={true}/>
        </div>
    )
}
export default CompareView