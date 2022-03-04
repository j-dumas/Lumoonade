import React, { useState, useEffect, useCallback } from 'react'
import { Line, Chart as Charts } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import GetColorBySlug from 'utils/color'
import Functions from 'services/CryptoService'
import 'chartjs-adapter-moment'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

const graph = require('app/socket/utils/graph')

const NB_DATA_DISPLAYED_1ST_VIEW = 24

function DetailedChartChart(props) {
	const [chartReference, setCR] = useState(React.createRef())
	const [data, setData] = useState()

	useEffect(async () => {
		setData(await Functions.GetCryptocurrencyChartDataBySlug(props.slug, props.dateRange, props.interval))
		props.socket.on('graph', (datas) => {
			datas = graph.adjustDateMiddleware(datas, props.dateRange)
			console.log(datas)
			const chart = chartReference.current
			if (!chart || isDataNull(datas)) return
			chart.data = getRelativeChartData(datas)
			chart.update()
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	function isDataNull(datas) {
		if (!datas || datas.length == 0 || !datas[0] || datas == undefined || datas[0].response == undefined) {
			return true
		} else return false
	}

	const getRelativeChartData = useCallback(
		(datas) => {
			if (isDataNull(datas)) return
			return {
				labels: datas[0].response[0].timestamp,
				datasets: getRelativeChartDataDatasets(datas)
			}
		},
		[getRelativeChartDataDatasets]
	)

	const getRelativeChartDataDatasets = useCallback((datas) => {
		const datasets = []
		datas.forEach((element) => {
			datasets.push(getRelativeChartDataDataset(element.symbol, element.response[0].indicators.quote[0].close))
		})
		return datasets
	}, [])

	function getRelativeChartDataDataset(name, data) {
		name = name.toString().split('-')[0]
		const color = GetColorBySlug(name)
		return {
			type: 'line',
			label: name.toUpperCase(),
			data: data,

			fill: false,
			lineTension: 0.05,
			backgroundColor: color,
			borderColor: color,
			borderWidth: 2.5,
			borderCapStyle: 'butt',
			//borderDash: [5, 5],
			hoverBorderColor: 'white',
			pointStyle: 'circle',
			pointRadius: 0
		}
	}

	function getChartOptionsPlugins() {
		return {
			title: {
				// Chart title
				display: false,
				text: 'Chart'
			},
			legend: {
				// Chart legend
				display: false,
				position: 'top'
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
				bodySpacing: 8
			},
			zoom: {
				zoom: {
					wheel: {
						enabled: true,
						speed: 0.05
					},
					pinch: {
						enabled: false
					},
					drag: {
						enabled: false
					},
					mode: 'x'
				},
				pan: {
					enabled: true,
					mode: 'x',
					//overScaleMode:'y',
					threshold: 0 // default:10
				},
				limits: {
					//y: {min: -1000, max: props.data[0].maxValue+1000},
					//x: {min: 500} //DATE_RANGE * INTERVAL * 24
				}
			}
		}
	}

	function getChartOptionsScales(datas) {
		return {
			x: {
				//min: datas[0].response[0].timestamp.length-10,//data[0].response[0].timestamp.length - NB_DATA_DISPLAYED_1ST_VIEW,
				grid: {
					display: true,
					drawBorder: true,
					borderColor: 'rgb(51, 52, 54)',
					color: 'red',
					borderWidth: 2,
					drawOnChartArea: false,
					drawTicks: false
				},
				title: {
					display: false,
					text: 'Time'
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
				beginAtZero: false,
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

	function getChartOptions(datas) {
		return {
			maintainAspectRatio: false,
			responsive: true,
			interaction: {
				mode: 'nearest',
				intersect: false,
				axis: 'x'
			},
			animation: {
				duration: 0
			},
			plugins: getChartOptionsPlugins(),
			scales: getChartOptionsScales(datas)
		}
	}

	return isDataNull(data) ? (
		<div>Loading...</div>
	) : (
		<div className="detailed-chart-chart">
			<Charts ref={chartReference} data={getRelativeChartData(data)} options={getChartOptions(data)} />
		</div>
	)
}

export default DetailedChartChart
