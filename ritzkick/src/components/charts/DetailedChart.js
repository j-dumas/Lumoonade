import React, { useEffect, useState } from 'react'
import Functions, {
	GetCryptocurrencyInformationsBySlug,
	GetTopEfficientCryptocurrencies,
	GetTopPopularCryptocurrencies
} from 'services/CryptoService'
import dynamic from 'next/dynamic'
import DetailedChartMenu from '@/components/menus/DetailedChartMenu'

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
		if (props.socket.id) {
			props.socket.emit('switch', props.socket.id, ['general', `graph-${dateRange}-${interval}`], true)
		}
	}, [dateRange, interval, props.socket])

	return (
		<div className="detailed-chart detailed-div">
			<DetailedChartMenu socket={props.socket} sendDateRange={setDateRange} sendInterval={setInterval} />
			<DetailedChartChart socket={props.socket} slug={props.slug} dateRange={dateRange} interval={interval} />
		</div>
	)
}

export default DetailedChart
