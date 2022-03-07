import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

function SimpleChart(props) {
	const [chartReference, setCR] = useState(React.createRef())

	const [datas, setDatas] = useState(() => {
		console.log(props.data)
		return {
			labels: props.data.response[0].timestamp,
			datasets: [
				{
					label: 'Value',
					fill: false,
					lineTension: 0.25,
					backgroundColor: 'rgb(38, 39, 40)',
					borderColor: () => {
						return props.increase ? 'rgb(102, 190, 84)' : 'rgb(234, 46, 73)'
					},
					borderWidth: 2,
					data: props.data.response[0].indicators.quote[0].close,
					pointStyle: 'circle',
					pointRadius: 0
				}
			]
		}
	})

	return (
		<div className="simple-chart">
			<Line
				ref={chartReference}
				data={datas}
				options={{
					maintainAspectRatio: false,
					responsive: true,
					plugins: {
						legend: {
							display: false,
							position: 'left'
						},
						title: {
							display: false,
							text: 'Chart.js Line Chart'
						},
						labels: {
							x: { display: false }
						}
					},
					scales: {
						x: {
							grid: {
								display: false,
								drawBorder: false,
								drawOnChartArea: false,
								drawTicks: false
							},
							ticks: {
								display: false
							}
						},
						y: {
							grid: {
								display: false,
								drawBorder: false,
								drawOnChartArea: false,
								drawTicks: false
							},
							ticks: {
								display: false
							}
						}
					},
					legend: {
						display: false
					},
					tooltips: {
						usePointStyle: false
					}
				}}
			/>
		</div>
	)
}

export default SimpleChart
