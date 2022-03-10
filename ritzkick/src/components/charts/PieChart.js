import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import GetColorBySlug from 'utils/color'
import { AreSlugsEqual } from 'utils/crypto'
import 'chart.js/auto'

function PieChart(props) {
	const [chartReference] = useState(React.createRef())

	const [data] = useState({
		maintainAspectRatio: false,
		responsive: false,
		labels: [0],
		datasets: [
			{
				data: [0],
				backgroundColor: ['gray']
			}
		]
	})

	useEffect(async () => {
		props.socket.on('data', (data) => {
			const chart = chartReference.current
			if (!chart) return
			chart.data = generateData(data, props.assets)
			chart.update('none')
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	function generateData(dataArr, assets) {
		if (assets == undefined) return
		let labels = []
		let data = []
		let backgroudColors = []
		let max = 0
		dataArr.forEach((datas) => {
			assets.forEach((asset) => {
				if (!AreSlugsEqual(asset.name, datas.fromCurrency)) return
				max += datas.regularMarketPrice * asset.amount
			})
		})
		dataArr.forEach((datas) => {
			assets.forEach((asset) => {
				if (!AreSlugsEqual(asset.name, datas.fromCurrency)) return
				labels.push(datas.fromCurrency.toString().toUpperCase())
				data.push(((datas.regularMarketPrice * asset.amount) / max) * 100)
				backgroudColors.push(GetColorBySlug(datas.fromCurrency.toString()))
			})
		})

		const pieData = {
			maintainAspectRatio: false,
			responsive: false,
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: backgroudColors
				}
			]
		}

		return pieData
	}

	const pieOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					color: 'white',
					font: {
						size: 14,
						lineHeight: 0
					},
					padding: 20,
					usePointStyle: true
				}
			},
			tooltip: {
				backgroundColor: 'rgba(28, 29, 31, 0.95)',
				padding: 20,
				cornerRadius: 5,
				borderRadius: 50,
				lineWidth: 10,
				boxPadding: 8,
				borderColor: 'rgb(51, 52, 54)',
				borderWidth: 1,
				caretSize: 0,
				caretPadding: 15,
				titleColor: 'rgb(158, 159, 160)',
				titleFont: {
					size: 14,
					weight: 'bold'
				},
				titleAlign: 'center',
				titleMarginBottom: 10,
				bodyFont: {
					size: 15,
					weight: 'bold',
					color: 'blue'
				},
				usePointStyle: true
			}
		},
		elements: {
			arc: {
				borderWidth: 1,
				borderColor: 'white'
			}
		}
	}

	return !data ? (
		<></>
	) : (
		<div className="column pie-chart">
			<p className="detailed-div-title">Assets division (%)</p>
			<Pie name="pie" data={data} options={pieOptions} ref={chartReference} />
		</div>
	)
}
// ref={input => {chartInstance = input}}
export default PieChart
