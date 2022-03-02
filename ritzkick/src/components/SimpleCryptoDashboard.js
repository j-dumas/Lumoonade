import React, { useState, useEffect } from 'react'
import SimpleCryptoView from '@/components/views/SimpleCryptoView'
import {isUserConnected} from '../../services/AuthService'
import {AreSlugsEqual} from '../../utils/crypto'

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
			console.log(data)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	return !datas || !chartDatas|| !props.socket? (
		<>Loading...</>
	) : (
		<>
			<div className="simple-crypto-dashboard v-center">
				<div className="simple-crypto-view row center">
					<div className='sub-section row space-between'>
						<div className="simple-crypto-view-item row left h-center">
							<div className="simple-crypto-view-logo"/>
							<div className="column simple-crypto-names">
								<p className="simple-crypto-name">Asset</p>
							</div>
						</div>

						{!props.assets?<></>:
						<>
							<p className="simple-crypto-view-item">Amount</p>
							<p className="simple-crypto-view-item">Total spent</p>
							<p className="simple-crypto-view-item">Value</p>
							<p className="simple-crypto-view-item simple-crypto-change">Wallet change</p>
						</>
						}

						<p className="simple-crypto-view-item simple-crypto-price">Price</p>
						<p className="simple-crypto-view-item simple-crypto-change c-white">24h Change</p>
						<p className="simple-chart"></p>
						{!isUserConnected()? <></> :<div className='icon'/>}
					</div>
				</div>
				{datas.map((element, i) => {
					let chartData = chartDatas.find((chartElement) => {
						return chartElement.symbol.toString().toUpperCase() == element.symbol.toString().toUpperCase()
					})
					let asset = null
					if (props.assets) {
						asset = props.assets.find((el) => {
							return AreSlugsEqual(el.name.toString().toUpperCase(), element.symbol.toString().toUpperCase())
						})
						console.log(asset)
					}
					
	
					return <SimpleCryptoView data={element} chartData={chartData} key={element.fromCurrency}/>
				})}
			</div>
		</>
	)
}

export default SimpleCryptoDashboard
