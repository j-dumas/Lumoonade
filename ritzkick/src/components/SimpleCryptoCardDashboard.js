import React, { useEffect, useState } from 'react'
import SimpleCryptoCard from '@/components/SimpleCryptoCard'

function SimpleCryptoCardDashboard(props) {
	const [datas, setDatas] = useState([])
	const [chartDatas, setChartDatas] = useState([])

	useEffect(() => {
		props.socket.on('data', (data) => setDatas(data))
		props.socket.on('graph', (data) => setChartDatas(data))
		if (props.socket) return () => props.socket.disconnect()
	}, [])
	return (
		<section className={props.small == true ? 'dashboard-small' : 'dashboard'}>
			{datas.map((element) => {
				let chartData = chartDatas.find((chartElement) => {
					return chartElement.symbol.toString().toUpperCase() == element.symbol.toString().toUpperCase()
				})

				return (
					<SimpleCryptoCard
						data={element}
						chartData={chartData}
						key={element.fromCurrency}
					/>
				)
			})}
		</section>
	)
}

export default SimpleCryptoCardDashboard
