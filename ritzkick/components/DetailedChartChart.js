import React, { useState, useEffect } from 'react'
import { Line, Chart as Charts } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
import Functions from '../services/CryptoService'
Chart.register(zoomPlugin)

const NB_DATA_DISPLAYED_1ST_VIEW = 24

function DetailedChartChart(props) {
	const chartReference = React.createRef()

	const [data, setData] = useState()
	useEffect(async () => {
		setData(await Functions.GetCryptocurrencyChartDataBySlug(props.slug, props.dateRange, props.interval))

		/*
       	setInterval(async () => {
            const chart = chartReference.current;
            if (chart != null) {
            chart.data = getRelativeChartData()
            chart.update()
            }
        }, 1000)
		*/
	}, [])

	function getRelativeChartData() {
		if (!data) return
		return {
			labels: data[0].response[0].timestamp,
			datasets: getRelativeChartDataDatasets()
		}
	}

	function getRelativeChartDataDatasets() {
		const datasets = []
		console.log(data)
		data.forEach((element) => {
			datasets.push(getRelativeChartDataDataset(element.symbol, element.response[0].indicators.quote[0].close))
		})
		return datasets
	}

	function getRelativeChartDataDataset(name, data) {
		return {
			type: 'line',
			label: name,
			data: data,

			fill: false,
			lineTension: 0.05,
			backgroundColor: 'orange',
			borderColor: 'orange',
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
			zoom: {
				zoom: {
					wheel: {
						enabled: true,
						speed: 0.01
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
					//x: {min: 5} //DATE_RANGE * INTERVAL * 24
				}
			}
		}
	}

	function getChartOptionsScales() {
		return {
			x: {
				//min: getChartData()[0].value.length - NB_DATA_DISPLAYED_1ST_VIEW,
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

	function getChartOptions() {
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
			scales: getChartOptionsScales()
		}
	}

	return !data ? (
		<div>Loading...</div>
	) : (
		<div className="detailed-chart-chart">
			<Charts ref={chartReference} data={getRelativeChartData()} options={getChartOptions()} />
		</div>
	)
}

export default DetailedChartChart
