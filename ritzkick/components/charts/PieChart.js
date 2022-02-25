import React, { useState, useEffect } from 'react'
import { Line, Doughnut, Pie, Chart as Charts } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

function PieChart(props) {
	useEffect(async () => {
        /*
		setData(await Functions.GetCryptocurrencyChartDataBySlug(props.slug, props.dateRange, props.interval))

		props.socket.on('graph', (datas) => {
			const chart = chartReference.current
			if (!chart || isDataNull(datas)) return
			chart.data = getRelativeChartData(datas)
			chart.update()
		})
		if (props.socket) return () => props.socket.disconnect()*/
	}, [])

    let chartInstance = null
    const pieData = {
        maintainAspectRatio: false,
        responsive: false,
        labels: ["ETH", "BTC", "LTC", "BNB","DOGE", "SHIB", "THETA", "ADA"],
        datasets: [
          {
            data: [1000, 2000, 550, 1000, 50, 50, 100, 200],
            backgroundColor: ['aqua', 'orange', 'gray', 'gold', 'green', 'yellow', 'magenta', 'blue'],
            //hoverBackgroundColor:  ['red', 'blue', 'green', 'yellow']
          }
        ]
      };

      const pieOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right'
              },
        },
        elements: {
          arc: {
            borderWidth: 1
          }
        }
      };
	return (
		<div className="pie-chart">
			<Pie 
                data={pieData}
                options={pieOptions}
                ref={input => {chartInstance = input;}}
            />
		</div>
	)
}

export default PieChart