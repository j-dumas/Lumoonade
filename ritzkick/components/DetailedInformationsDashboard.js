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
import DetailedChart from './charts/DetailedChart'
import CompareMenu from './menus/CompareMenu'
import { useRouter } from 'next/router'

const io = require('socket.io-client')
const parser = require('../application/socket/utils/parser')

const DetailedInformationsDashboard = (props) => {
	const [data, setData] = useState([])
	useEffect(async () => {
		props.socket.on('data', (a) => {
			let b = a.find((x) => {
				console.log(x.symbol, props.socket.auth.query)
				return parser.sameString(x.symbol, props.socket.auth.query)
			})
			setData(b === undefined ? undefined : [b])
		})
		if (props.socket) return () => socket.disconnect()
	}, [])

	// Validation:
	if (!props.currency) return <div>Impossible action.</div>

	return !data ? (
		<h1>Wait...</h1>
	) : (
		<div className="row start">
			{data.map((element) => {
				return <DetailedInformations data={element} name={props.name} key={element.fromCurrency} />
			})}
		</div>
	)
}
export default DetailedInformationsDashboard
