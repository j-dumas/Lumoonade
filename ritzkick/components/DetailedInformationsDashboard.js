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

    const [data, setData] = useState([])
	useEffect(async () => {
		props.socket.on('data', (data) => {
			setData(data)
		})
		if (props.socket) return () => socket.disconnect()
	}, [])

    return (
        <div className='row start'>
            {data.map((element) => {
                return <DetailedInformations data={element} name={props.name} key={element.fromCurrency}/>
            })}
        </div>
    )
}
export default CompareView