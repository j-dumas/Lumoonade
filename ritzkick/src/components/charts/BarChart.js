import React, { useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import GetColorBySlug from 'utils/color'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

function BarChart(props) {
	const chartReference = React.createRef()

	const data = {
		maintainAspectRatio: false,
		responsive: false,
		labels: [0],
		datasets: [
			{
				data: [0],
				backgroundColor: ['gray']
			}
		]
	}

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
		dataArr.forEach((datas) => {
			assets.forEach((asset) => {
				if (asset.name.toString().toUpperCase() != datas.fromCurrency.toString().toUpperCase()) return
				labels.push(datas.fromCurrency.toString().toUpperCase())
				data.push(datas.regularMarketPrice * asset.amount)
				backgroudColors.push(GetColorBySlug(datas.fromCurrency.toString()))
			})
		})

		const barData = {
			maintainAspectRatio: false,
			responsive: true,
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: backgroudColors
				}
			]
		}

		return barData
	}

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: 'nearest',
			intersect: false,
			axis: 'x'
		},
		plugins: {
			legend: {
				display: false
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
			},
			zoom: {
				zoom: {
					wheel: {
						enabled: false,
						speed: 0.05
					},
					pinch: {
						enabled: true
					},
					drag: {
						enabled: false
					},
					mode: 'x'
				},
				pan: {
					enabled: true,
					mode: 'x',
					threshold: 0 // default:10
				}
			}
		},
		scales: {
			x: {
				max: 5,
				grid: {
					display: true,
					drawBorder: true,
					borderColor: 'rgb(51, 52, 54)',
					color: 'red',
					borderWidth: 2,
					drawOnChartArea: false,
					drawTicks: false
				},
				ticks: {
					display: true,
					color: 'rgb(158,159,160)',
					padding: 10,
					font: {
						size: 13
					}
				}
			},
			y: {
				min: 0,
				grid: {
					display: true,
					drawBorder: false,
					drawOnChartArea: true,
					drawTicks: false,
					color: 'rgb(51, 52, 54)',
					borderDash: [8, 8],
					borderWidth: 1
				},
				ticks: {
					display: true,
					color: 'rgb(158,159,160)',
					padding: 12,
					font: {
						size: 12.5
					}
				}
			}
		}
	}

	return !data ? (
		<></>
	) : (
		<div className="column bar-chart">
			<p className="detailed-div-title">Assets division ($)</p>
			<Bar name="bar" data={data} options={barOptions} ref={chartReference} />
		</div>
	)
}
export default BarChart
