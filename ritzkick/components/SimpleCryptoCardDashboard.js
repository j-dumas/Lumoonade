import React, { useState, useEffect } from 'react'
import SimpleCryptoCard from './SimpleCryptoCard'

function SimpleCryptoCardDashboard(props) {
	const [datas, setDatas] = useState([])
	const [chartDatas, setChartDatas] = useState([])

    useEffect(() => {
		props.socket.on('data', (data) => {
			setDatas(data)
			console.log(data)
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
				let chartData = chartDatas.find((chartElement) => {
					return (chartElement.symbol.toString().toUpperCase() == element.symbol.toString().toUpperCase())
				})

                return (
                    <SimpleCryptoCard data={element} chartData={chartData} key={element.fromCurrency}/>
                )
            })}
		</section>
	)
}

export default SimpleCryptoCardDashboard