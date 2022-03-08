import React, { useState, useEffect } from 'react'
import ButtonLegend from '@/components/ButtonLegend'

export default function DetailedChartMenu(props) {
	const [dateRange, setDateRange] = useState('5d')
	const [currentInterval, setCurrentInterval] = useState('15m')
	const [intervals, setIntervals] = useState(getIntervalOptionsByDateRange(dateRange))

	return (
		<div className="detailed-div-menu row h-center space-between">
			<div className="row detailed-chart-legend left h-center">
				<p>Price (real time)</p>
			</div>
			<div className="row detailed-chart-options left">
				<div className="row h-center">
					<label htmlFor="daterange" className="detailed-div-label">Date range</label>
					<select
						onChange={(e) => {
							props.sendDateRange(e.target.value)
							let availableIntervals = getIntervalOptionsByDateRange(e.target.value)
							if (
								!availableIntervals.find((inter) =>
									inter.toLocaleLowerCase().includes(currentInterval.toLocaleLowerCase())
								)
							) {
								let value = getIntervalOptionsByDateRange(e.target.value)[0]
								props.sendInterval(value)
								setCurrentInterval(value)
							}
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
							setCurrentInterval(e.target.value)
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
		default:
			return ['1m', '2m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo', '3mo']
	}
}

/*
	<ButtonLegend
		sendData={getShowPrice}
		value={showPrice}
		name="Price"
		backgroundColor="var(--background-color-3)"
	/>
*/