import React, { useEffect, useState } from 'react'
import SimpleCryptoView from '@/components/views/SimpleCryptoView'
import { isUserConnected } from '../../services/AuthService'
import { AreSlugsEqual } from '../../utils/crypto'
import { CircularProgress } from '@mui/material'

function SimpleCryptoDashboard(props) {
	const [datas, setDatas] = useState([])
	const [chartDatas, setChartDatas] = useState()

	useEffect(() => {
		if (!props.socket) return
		props.socket.on('data', (data) => {
			setDatas(data)
		})
		props.socket.on('graph', (data) => {
			setChartDatas(data)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [props.socket])

	return !datas || !chartDatas || !props.socket || !props.socket.connected ? (
		<div className="column center">
			<CircularProgress color="secondary" />
		</div>
	) : (
		<>
			<div className="simple-crypto-dashboard v-center">
				<div className="simple-crypto-dashboard-menu row center">
					<div className="sub-section row space-between">
						<div className="simple-crypto-view-item-big row left h-center">
							<p>Asset</p>
						</div>
						<p className="simple-crypto-view-item">Slug</p>
						<p className="simple-crypto-view-item">Price</p>
						<p className="simple-crypto-view-item-big simple-crypto-change">24h Change</p>
						<p className="simple-chart-label"></p>
						{!isUserConnected() ? <></> : <div className="icon" />}
					</div>
				</div>
				{datas.map((element, i) => {
					let chartData = chartDatas.find((chartElement) => {
						return chartElement.symbol.toString().toUpperCase() == element.symbol.toString().toUpperCase()
					})
					let asset = null
					if (props.assets) {
						asset = props.assets.find((el) => {
							return AreSlugsEqual(
								el.name.toString().toUpperCase(),
								element.symbol.toString().toUpperCase()
							)
						})
					}

					return <SimpleCryptoView data={element} chartData={chartData} key={element.fromCurrency} />
				})}
			</div>
		</>
	)
}

export default SimpleCryptoDashboard
