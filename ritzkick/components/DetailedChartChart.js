import React, { useState, useEffect } from 'react'
import { Line, Chart as Charts } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import Functions from '../services/CryptoService'
import 'chartjs-adapter-moment'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

const NB_DATA_DISPLAYED_1ST_VIEW = 24

function DetailedChartChart(props) {
	const [chartReference, setCR] = useState(React.createRef())

	function isDataNull(datas) {
		if (!datas || datas.length == 0 || !datas[0] || datas == undefined || datas[0].response == undefined) {
			return true
		} else return false
	}

	const [data, setData] = useState()
	/*
	useEffect(async () => {
		
	})*/
    useEffect(async ()=> {
		setData(await Functions.GetCryptocurrencyChartDataBySlug(props.slug, props.dateRange, props.interval))

		props.socket.on('graph', (datas) => {
			const chart = chartReference.current;
			if (chart !== null || !isDataNull(datas)) {				
				chart.data = getRelativeChartData(datas)
				chart.update()
			}
		})
		if (props.socket) return () => socket.disconnect();
    }, [])
    
    function getRelativeChartData(datas) {
		if (isDataNull(datas)) return
        return {
            labels: datas[0].response[0].timestamp,
            datasets: getRelativeChartDataDatasets(datas)
        }
    }

	function getRelativeChartDataDatasets(datas) {
		const datasets = []
		datas.forEach((element) => {
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
			pointRadius: 0,
		}
	}

	function getChartOptionsPlugins() {
		return {
			title: {
				// Chart title
				display: false,
				text: 'Chart',
			},
			legend: {
				// Chart legend
				display: false,
				position: 'top',
			},
			zoom: {
				zoom: {
					wheel: {
						enabled: true,
						speed: 0.05,
					},
					pinch: {
						enabled: false,
					},
					drag: {
						enabled: false,
					},
					mode: 'x',
				},
				pan: {
					enabled: true,
					mode: 'x',
					//overScaleMode:'y',
					threshold: 0, // default:10
				},
				limits: {
					//y: {min: -1000, max: props.data[0].maxValue+1000},
					//x: {min: 500} //DATE_RANGE * INTERVAL * 24
				},
			},
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
                    drawTicks: false,
                },
                title: {
                    display:false,
                    text: 'Time'
                },
				ticks: {
                    display:true,
                    color: 'rgb(158,159,160)',
					padding: 10,
					font: {
						size: 13
					}
                },
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
                    display:true,
                    color: 'rgb(158,159,160)',
					padding: 12,
					font: {
						size: 12.5
					}
                }
            },
        }
    }

	function getChartOptions(datas) {
		return {
			maintainAspectRatio: false,
			responsive: true,
			interaction: {
				mode: 'nearest',
				intersect: false,
				axis: 'x',
			},
			animation: {
				duration: 0,
			},
			plugins: getChartOptionsPlugins(),
			scales: getChartOptionsScales(datas),
		}
	}

	return (
		isDataNull(data) ? <div>Loading...</div>:
		<div className='detailed-chart-chart'>
			<Charts
				ref={chartReference}
				data={getRelativeChartData(data)}
				options={getChartOptions(data)}
			/>
		</div>
	)
}

export default DetailedChartChart