import React, { useEffect, useState } from 'react'
import ButtonLegend from '@/components/ButtonLegend'

import { useTranslation } from 'next-i18next'

export default function DetailedChartMenu(props) {
	const { t } = useTranslation('detailedchart')

	const [dateRange, setDateRange] = useState('5d')
	const [currentInterval, setCurrentInterval] = useState(`15${t('menu.intervals.minute')}`)
	const [intervals, setIntervals] = useState(getIntervalOptionsByDateRange(dateRange, t))

	return (
		<div className="detailed-div-menu row h-center space-between">
			<div className="row detailed-chart-legend left h-center">
				<p className="detailed-div-title">{t('menu.price')}</p>
			</div>
			<div className="row detailed-chart-options left">
				<div className="row h-center">
					<label htmlFor="daterange" className="detailed-div-label">
						{t('menu.range')}
					</label>
					<select
						onChange={(e) => {
							props.sendDateRange(e.target.value)
							let availableIntervals = getIntervalOptionsByDateRange(e.target.value, t)
							if (
								!Object.keys(availableIntervals).find((inter) =>
									inter.toLocaleLowerCase().includes(currentInterval.toLocaleLowerCase())
								)
							) {
								let value = getIntervalOptionsByDateRange(e.target.value, t)[
									Object.keys(availableIntervals)[0]
								]
								props.sendInterval(value)
								setCurrentInterval(value)
							}
							setDateRange(e.target.value)
							setIntervals(getIntervalOptionsByDateRange(e.target.value, t))
						}}
						defaultValue="5d"
						className="detailed-chart-options-select"
						name="daterange"
					>
						<optgroup label={t('menu.range')}>
							<option value="1d">{`1 ${t('menu.ranges.day')}`}</option>
							<option value="5d">{`5 ${t('menu.ranges.days')}`}</option>
							<option value="1mo">{`1 ${t('menu.ranges.month')}`}</option>
							<option value="3mo">{`3 ${t('menu.ranges.months')}`}</option>
							<option value="6mo">{`6 ${t('menu.ranges.months')}`}</option>
							<option value="1y">{`1 ${t('menu.ranges.year')}`}</option>
							<option value="2y">{`2 ${t('menu.ranges.years')}`}</option>
							<option value="5y">{`5 ${t('menu.ranges.years')}`}</option>
						</optgroup>
					</select>
				</div>
				<div className="row h-center">
					<label htmlFor="interval" className="detailed-div-label">
						{t('menu.interval')}
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
						<optgroup label={t('menu.interval')}>
							{Object.keys(getIntervalOptionsByDateRange(dateRange, t)).map((element) => {
								let value = getIntervalOptionsByDateRange(dateRange, t)[element]
								return (
									<option key={element} value={element}>
										{value}
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

export function getIntervalOptionsByDateRange(dateRange, t) {
	switch (dateRange) {
		case '1d':
			return {
				'1m': `1${t('menu.intervals.minute')}`,
				'2m': `2${t('menu.intervals.minute')}`,
				'5m': `5${t('menu.intervals.minute')}`,
				'15m': `15${t('menu.intervals.minute')}`,
				'30m': `30${t('menu.intervals.minute')}`,
				'1h': `1${t('menu.intervals.hour')}`
			}
		case '5d':
			return {
				'1m': `1${t('menu.intervals.minute')}`,
				'2m': `2${t('menu.intervals.minute')}`,
				'5m': `5${t('menu.intervals.minute')}`,
				'15m': `15${t('menu.intervals.minute')}`,
				'30m': `30${t('menu.intervals.minute')}`,
				'1h': `1${t('menu.intervals.hour')}`,
				'1d': `1${t('menu.intervals.day')}`
			}
		case '1mo':
			return {
				'2m': `2${t('menu.intervals.minute')}`,
				'5m': `5${t('menu.intervals.minute')}`,
				'15m': `15${t('menu.intervals.minute')}`,
				'30m': `30${t('menu.intervals.minute')}`,
				'1h': `1${t('menu.intervals.hour')}`,
				'1d': `1${t('menu.intervals.day')}`,
				'1wk': `1${t('menu.intervals.week')}`
			}
		case '3mo':
			return {
				'1h': `1${t('menu.intervals.hour')}`,
				'1d': `1${t('menu.intervals.day')}`,
				'1wk': `1${t('menu.intervals.week')}`,
				'1mo': `1${t('menu.intervals.month')}`
			}
		case '6mo':
			return {
				'1h': `1${t('menu.intervals.hour')}`,
				'1d': `1${t('menu.intervals.day')}`,
				'1wk': `1${t('menu.intervals.week')}`,
				'1mo': `1${t('menu.intervals.month')}`,
				'3mo': `3${t('menu.intervals.month')}`
			}
		case '1y':
			return {
				'1h': `1${t('menu.intervals.hour')}`,
				'1d': `1${t('menu.intervals.day')}`,
				'1wk': `1${t('menu.intervals.week')}`,
				'1mo': `1${t('menu.intervals.month')}`,
				'3mo': `3${t('menu.intervals.month')}`
			}
		case '2y':
			return {
				'1h': `1${t('menu.intervals.hour')}`,
				'1d': `1${t('menu.intervals.day')}`,
				'1wk': `1${t('menu.intervals.week')}`,
				'1mo': `1${t('menu.intervals.month')}`,
				'3mo': `3${t('menu.intervals.month')}`
			}
		case '5y':
			return {
				'1d': `1${t('menu.intervals.day')}`,
				'1wk': `1${t('menu.intervals.week')}`,
				'1mo': `1${t('menu.intervals.month')}`,
				'3mo': `3${t('menu.intervals.month')}`
			}
		default:
			return {
				'1m': `1${t('menu.intervals.minute')}`,
				'2m': `2${t('menu.intervals.minute')}`,
				'5m': `5${t('menu.intervals.minute')}`,
				'15m': `15${t('menu.intervals.minute')}`,
				'30m': `30${t('menu.intervals.minute')}`,
				'1h': `1${t('menu.intervals.hour')}`,
				'1d': `1${t('menu.intervals.day')}`,
				'1wk': `1${t('menu.intervals.week')}`,
				'1mo': `1${t('menu.intervals.month')}`,
				'3mo': `3${t('menu.intervals.month')}`
			}
	}
}
