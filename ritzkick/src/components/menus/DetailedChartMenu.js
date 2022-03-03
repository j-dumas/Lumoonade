import React, { useEffect, useState } from 'react'
import ButtonLegend from '@/components/ButtonLegend'

export default function DetailedChartMenu(props) {
	const [showPrice, setShowPrice] = useState(true)
	const [showChange, setShowChange] = useState(false)
	const [showVolume, setShowVolume] = useState(false)

	const [dateRange, setDateRange] = useState('5d')
	const [intervals, setIntervals] = useState(getIntervalOptionsByDateRange(dateRange))

	function getShowPrice(value) {
		setShowPrice(value)
	}
	function getShowChange(value) {
		setShowChange(value)
	}
	function getShowVolume(value) {
		setShowVolume(value)
	}

	return (
		<div className="detailed-div-menu row h-center space-between">
			<div className="row detailed-chart-legend left h-center">
				{
					<ButtonLegend
						sendData={getShowPrice}
						value={showPrice}
						name="Price"
						backgroundColor="var(--background-color-3)"
					/>
				}
			</div>
			<div className="row detailed-chart-options left">
				<div className="row h-center">
					<label htmlFor="daterange" className="detailed-div-label">
						Date range
					</label>
					<select
						onChange={(e) => {
							props.sendDateRange(e.target.value)
							props.sendInterval(getIntervalOptionsByDateRange(e.target.value)[0])
							setDateRange(e.target.value)
							setIntervals(getIntervalOptionsByDateRange(e.target.value))
						}}
						defaultValue="5d"
						className="detailed-chart-options-select"
						name="daterange"
					>
						<optgroup label="Date Range">
							<option value="1d">1 day</option>
							<option value="5d">5 days</option>
							<option value="1mo">1 month</option>
							<option value="3mo">3 months</option>
							<option value="6mo">6 months</option>
							<option value="1y">1 year</option>
							<option value="2y">2 years</option>
							<option value="5y">5 years</option>
						</optgroup>
					</select>
				</div>
				<div className="row h-center">
					<label htmlFor="interval" className="detailed-div-label">
						Interval
					</label>
					<select
						onChange={(e) => {
							props.sendInterval(e.target.value)
						}}
						defaultValue="15m"
						className="detailed-chart-options-select"
						name="interval"
					>
						<optgroup label="Interval">
							{intervals.map((element) => {
								return (
									<option key={element} value={element}>
										{element}
									</option>
								)
							})}
						</optgroup>
					</select>
				</div>
			</div>
		</div>
	)
}

export function getIntervalOptionsByDateRange(dateRange) {
	switch (dateRange) {
		case '1d':
			return ['1m', '2m', '5m', '15m', '30m', '1h']
		case '5d':
			return ['1m', '2m', '5m', '15m', '30m', '1h', '1d']
		case '1mo':
			return ['2m', '5m', '15m', '30m', '1h', '1d', '1wk']
		case '3mo':
			return ['1h', '1d', '1wk', '1mo']
		case '6mo':
			return ['1h', '1d', '1wk', '1mo', '3mo']
		case '1y':
			return ['1h', '1d', '1wk', '1mo', '3mo']
		case '2y':
			return ['1h', '1d', '1wk', '1mo', '3mo']
		case '5y':
			return ['1d', '1wk', '1mo', '3mo']
		case 'max':
			return ['1m', '2m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo', '3mo']
	}
}

/*

<select onChange={(e) => {props.sendInterval(e.target.value)}} defaultValue="15m" className='detailed-chart-options-select' name="interval">
    <optgroup label="Interval">
        <option value="1m">1 min</option>
        <option value="2m">2 mins</option>
        <option value="5m">5 mins</option>
        <option value="15m">15 mins</option>
        <option value="30m">30 mins</option>
        <option value="1h">1 hour</option>
        <option value="1d">1 day</option>
        <option value="1wk">1 week</option>
        <option value="1mo">1 month</option>
        <option value="3mo">3 months</option>
    </optgroup>
</select>

*/
