import React, { useState, useEffect } from 'react'
import Functions, {
	GetCryptocurrencyInformationsBySlug,
	GetTopPopularCryptocurrencies,
	GetTopEfficientCryptocurrencies
} from '../services/CryptoService'
import dynamic from 'next/dynamic'
import DetailedChartMenu from './DetailedChartMenu'

const DetailedChartChart = dynamic(
	() => {
		return import('./DetailedChartChart')
	},
	{ ssr: false }
)

function DetailedChart(props) {
	const [showPrice, setShowPrice] = useState(true)
	const [showChange, setShowChange] = useState(false)
	const [showVolume, setShowVolume] = useState(false)
	const [dateRange, setDateRange] = useState('5d')
	const [interval, setInterval] = useState('15m')

	useEffect(() => {
		props.socket.emit('switch', props.socket.id, ['general', `graph-${dateRange}-${interval}`], true)
	}, [dateRange, interval])

	return (
		<div className="detailed-chart detailed-div">
			<DetailedChartMenu sendDateRange={setDateRange} sendInterval={setInterval} />
			<DetailedChartChart socket={props.socket} slug="ETH-CAD" dateRange={dateRange} interval={interval} />
		</div>
	)
}

export default DetailedChart
