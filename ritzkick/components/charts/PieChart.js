import React, { useState, useEffect } from 'react'
import { Line, Doughnut, Pie, Chart as Charts } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import GetColorBySlug from '../../utils/color'

function PieChart(props) {
    if (!props.data || props.data.length == 0) return (<></>)
	useEffect(async () => {}, [])

    function generateData() {
        let labels = []
        let data = []
        let backgroudColors = []
        props.data.map((asset) => {
            labels.push(asset.name)
            data.push(asset.totalSpent)
            backgroudColors.push(GetColorBySlug(asset.name))
        })

        const pieData = {
            maintainAspectRatio: false,
            responsive: false,
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: backgroudColors,
              }
            ]
        }
        
        return pieData
    }

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

    let chartInstance = null
	return (
		<div className="pie-chart">
			<Pie 
                data={generateData()}
                options={pieOptions}
                ref={input => {chartInstance = input}}
            />
		</div>
	)
}

export default PieChart