import React, { useState, useEffect } from 'react'
import { Line, Doughnut, Pie, Chart as Charts } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import GetColorBySlug from '../../../utils/color'
import { getUserDashboardData } from '../../../services/dashboard-service'

function PieChart(props) {
	const [chartReference, setCR] = useState(React.createRef())
	//if (!props.data || props.data.length == 0) return (<></>)

	const [data, setData] = useState({
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

	const [assets, setAssets] = useState(async (el) => {
		console.log(el)
		let d = await getUserDashboardData()
		return d.assets
	})

	useEffect(async () => {
		//let userData = await getUserDashboardData()
		let userData = {
			assets: [
				{
					name: 'eth',
					totalSpent: 1000,
					holding: 0.2,
					transactions: 1
				},
				{
					name: 'btc',
					totalSpent: 3400,
					holding: 0.001,
					transactions: 1
				},
				{
					name: 'ltc',
					totalSpent: 200,
					holding: 1.3,
					transactions: 1
				}
			]
		}
		setAssets(userData.assets)
		console.log(assets)
	}, [])

	useEffect(async () => {
		props.socket.on('data', async (data) => {
			const chart = chartReference.current
			if (!chart) return
			chart.data = generateData(data, await assets)
			chart.update('none')
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	function generateData(dataArr, assets) {
		let labels = []
		let data = []
		let backgroudColors = []
		dataArr.forEach((datas) => {
			assets.forEach((asset) => {
				if (asset.name.toString().toUpperCase() != datas.fromCurrency.toString().toUpperCase()) return
				labels.push(datas.fromCurrency.toString().toUpperCase())
				data.push(datas.regularMarketPrice * asset.holding)
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

	let chartInstance = null
	return !data ? (
		<></>
	) : (
		<div className="pie-chart">
			<p className="detailed-div-title">Assets Division</p>
			<Pie name="pie" data={data} options={pieOptions} ref={chartReference} />
		</div>
	)
}
//ref={input => {chartInstance = input}}
export default PieChart
