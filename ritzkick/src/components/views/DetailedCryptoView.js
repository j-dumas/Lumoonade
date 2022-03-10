import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Icons from '@/components/Icons'
import Functions, {
	GetCryptocurrencyInformationsBySlug,
	GetTopEfficientCryptocurrencies,
	GetTopPopularCryptocurrencies
} from 'services/CryptoService'
import ButtonFavorite from '@/components/ButtonFavorite'
import DetailedInformationsDashboard from '@/components/DetailedInformationsDashboard'
import DetailedChart from '@/components/charts/DetailedChart'
import {createSocket} from '../../../services/SocketService'

import dynamic from 'next/dynamic'
const DetailedMenu = dynamic(
	() => {
		return import('../../components/menus/DetailedMenu')
	},
	{ ssr: false }
)

const io = require('socket.io-client')

const DetailedInformationsDashboard = dynamic(() => import('@/components/DetailedInformationsDashboard'))
const DetailedChart = dynamic(() => import('@/components/charts/DetailedChart'))
const DetailedMenu = dynamic(() => import('@/components/menus/DetailedMenu'))

function DetailedCryptoView(props) {
	const [slug, setSlug] = useState(props.slug + '-' + props.currency)
	const [firstData, setFirstData] = useState()
	const [socket, setSocket] = useState()

	const [dateRange, setDateRange] = useState('5d')
	const [interval, setInterval] = useState('15m')

	useEffect(async () => {
		setFirstData(await Functions.GetCryptocurrencyInformationsBySlug(slug))
		
		setSocket(
			createSocket(['general', `graph-${dateRange}-${interval}`], [slug],`wss://${window.location.host}/`)
		)
	}, [dateRange, interval, slug])

	// Validation:
	if (!props.slug || !props.currency) return <div>Impossible action.</div>

	return !firstData || !socket ? (
		<p>Loading...</p>
	) : (
		<>
			<div className="detailed-crypto-view column">
				<DetailedMenu slug={slug} firstData={firstData} />
				<div className="row space-between">
					<DetailedInformationsDashboard socket={socket} currency={props.currency} name={false} />
					<DetailedChart socket={socket} slug={slug} />
				</div>
			</div>
		</>
	)
}

export default DetailedCryptoView

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
