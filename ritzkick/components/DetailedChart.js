import React, { useState, useEffect } from 'react'
import { Line, Chart as Charts } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(zoomPlugin)

const NB_DATA_DISPLAYED_1ST_VIEW = 24

function DetailedChart(props) {
	const chartReference = React.createRef()
	const getChartData = () => {
		return props.getChartDatas()
	}

    useEffect(()=> {
       setInterval(async () => {
            const chart = chartReference.current;
            if (chart != null) {
            chart.data = getRelativeChartData()
            chart.update()
            }
        }, 1000)
    })
    
    function getRelativeChartData() {
        return {
            labels: getChartData()[0].x,
            datasets: getRelativeChartDataDatasets()
        }
    }

	function getRelativeChartDataDatasets() {
		const datasets = []
		getChartData().forEach((element) => {
			datasets.push(getRelativeChartDataDataset(element.name, element.value, element.color))
		})
		return datasets
	}

	function getRelativeChartDataDataset(name, data, color) {
		return {
			type: 'line',
			label: name,
			data: data,

			fill: false,
			lineTension: 0.1,
			backgroundColor: color,
			borderColor: color,
			borderWidth: 3,
			borderCapStyle: 'butt',
			//borderDash: [5, 5],
			hoverBorderColor: 'white',
			pointStyle: 'circle',
			pointRadius: 2,
		}
	}

	function getChartOptionsPlugins() {
		return {
			title: {
				// Chart title
				display: false,
				text: '',
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
						speed: 0.01,
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
					//x: {min: 5} //DATE_RANGE * INTERVAL * 24
				},
			},
		}
	}

    function getChartOptionsScales() {
        return {
            x: {
                min: getChartData()[0].value.length - NB_DATA_DISPLAYED_1ST_VIEW,
                grid: {
                    display: true,
                    drawBorder: true,
                    borderColor: 'dimgray',
                    color: 'red',
                    borderWidth: 1,
                    drawOnChartArea: false,
                    drawTicks: false,
                },
                ticks: {
                    display:true,
                    color: 'white'
                },
                title: {
                    display:false,
                    text: 'Time'
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    display: true,
                    drawBorder: false,
                    drawOnChartArea: true,
                    drawTicks: false,
                    color: 'dimgray',
                    borderDash: [10, 10],
                    borderWidth: 1
                },
                ticks: {
                    display:true,
                    color: 'white'
                }
            },
        }
    }

	function getChartOptions() {
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
			scales: getChartOptionsScales(),
		}
	}

	return (
		<div className='detailed-chart'>
			<Charts
				ref={chartReference}
				data={getRelativeChartData()}
				options={getChartOptions()}
			/>
		</div>
	)
}

export default DetailedChart