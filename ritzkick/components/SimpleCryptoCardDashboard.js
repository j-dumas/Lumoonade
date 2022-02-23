import React, { useState, useEffect } from 'react'
import SimpleCryptoCard from './SimpleCryptoCard'

function SimpleCryptoCardDashboard(props) {
	const [datas, setDatas] = useState([])
	const [chartDatas, setChartDatas] = useState([])

    useEffect(() => {
		props.socket.on('data', (data) => {
			setDatas(data)
			//if(data.length > 1) {
			//console.log(data[0].regularMarketPrice)}
		})
		props.socket.on('graph', (data) => {
			setChartDatas(data)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	return (
		<section className="section row center start principal">
			{
			
			datas.map((element, i) => {
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