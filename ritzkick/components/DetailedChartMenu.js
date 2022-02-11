import React, { useState, useEffect } from 'react'
import ButtonLegend from './ButtonLegend'

function DetailedChartMenu(props) {
	const [showPrice, setShowPrice] = useState(true)
	const [showChange, setShowChange] = useState(false)
	const [showVolume, setShowVolume] = useState(false)

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
				<ButtonLegend
					sendData={getShowPrice}
					value={showPrice}
					name="Price"
					backgroundColor="var(--main-color)"
				/>
				<ButtonLegend sendData={getShowChange} value={showChange} name="24h change" backgroundColor="orange" />
				<ButtonLegend sendData={getShowVolume} value={showVolume} name="24h volume" backgroundColor="red" />
			</div>
			<div className="row detailed-chart-options left">
				<div className="row h-center">
					<label htmlFor="interval" className="detailed-div-title">
						Date range
					</label>
					<select
						onChange={(e) => {
							props.sendDateRange(e.target.value)
						}}
						defaultValue="5D"
						className="detailed-chart-options-select"
						name="daterange"
					>
						<optgroup label="Date Range">
							<option value="1D">1 day</option>
							<option value="5D">5 days</option>
							<option value="1M">1 month</option>
							<option value="3M">3 months</option>
							<option value="6M">6 months</option>
							<option value="1Y">1 year</option>
							<option value="2Y">2 years</option>
							<option value="5Y">5 years</option>
						</optgroup>
					</select>
				</div>
				<div className="row h-center">
					<label htmlFor="interval" className="detailed-div-title">
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
				</div>
			</div>
		</div>
	)
}

export default DetailedChartMenu
