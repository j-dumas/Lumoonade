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
import DetailedMenu from './DetailedMenu'

const io = require('socket.io-client')

function DetailedCryptoView(props) {
	const [slug, setSlug] = useState(props.slug + '-' + props.currency)
	const [firstData, setFirstData] = useState()
	const [socket, setSocket] = useState()

	const [dateRange, setDateRange] = useState('5d')
	const [interval, setInterval] = useState('15m')

	useEffect(async () => {
		setFirstData(await Functions.GetCryptocurrencyInformationsBySlug(slug))

		console.log(`${window.location.protocol}${window.location.hostname}`)

		setSocket(
			io(`${window.location.protocol}${window.location.hostname}`, {
					auth: {
						rooms: ['general', `graph-${dateRange}-${interval}`],
						query: [slug],
						graph: true
					}
				}
			)
		)
	}, [])

	// Validation:
	if (!props.slug || !props.currency) return <div>Impossible action.</div>

	return !firstData || !socket ? (
		<p>Loading...</p>
	) : (
		<>
			<div className="detailed-crypto-view column">
				<DetailedMenu slug={slug} firstData={firstData} />
				<div className="row space-between">
					<DetailedInformations socket={socket} slug={slug} firstData={firstData} />
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
