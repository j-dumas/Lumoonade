import React, { useState, useEffect } from 'react'
import SimpleCryptoView from './SimpleCryptoView'
import SimpleCryptoCard from './SimpleCryptoCard'
import Functions from '../services/CryptoService'

function SimpleCryptoCardDashboard(props) {
	const [datas, setDatas] = useState([])
	const [chartDatas, setChartDatas] = useState([])

    useState(() => {
		props.socket.on('data', (data) => {
			setDatas(data)
		})
		props.socket.on('graph', (data) => {
			setChartDatas(data)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	return (
		<section className="section row center principal">
			{datas.map((element, i) => {
				let chartData = null
				chartDatas.map((chartElement) => {
					if (chartElement.symbol.toString().toUpperCase() == element.symbol.toString().toUpperCase()) {
						chartData = chartElement
					}
				})
				
                return (
                    <SimpleCryptoCard data={element} chartData={chartData} key={element.fromCurrency}/>
                )
            })}
		</section>
	)
}

export default SimpleCryptoCardDashboard