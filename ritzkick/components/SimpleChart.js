import React, {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto'

function SimpleChart(props) {
    const [datas, setDatas] = useState({
        labels: props.data.x,
        datasets: [
            {
            label: props.data.name,
            fill: false,
            lineTension: .25,
            backgroundColor: 'rgb(38, 39, 40)',
            borderColor: () => {return (props.data.value[props.data.value.length-1] > props.data.value[0])? ('lightgreen'):(props.data.value[props.data.value.length-1] == props.data.value[0])?('gainsboro'):('lightcoral')},
            borderWidth: 2,
            data: props.data.value,
            pointStyle: 'circle',
            pointRadius: 0
            }
        ]
    });

    return (
        <div className='simple-chart'>
        <Line 
            data={datas}
            options={{
                maintainAspectRatio:false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'left',
                    },
                    title: {
                        display: false,
                        text: 'Chart.js Line Chart',
                    },
                    labels: {
                        x: {display:false}
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                        },
                        ticks: {
                            display:false
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                        },
                        ticks: {
                            display:false
                        }
                    },
                },
                legend: {
                    display: false
                },
                tooltips: {
                    usePointStyle: false,
                }
                }}
        />
        </div>
    );
    };

export default SimpleChart;