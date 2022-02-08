import React, { useState, useEffect } from 'react'
import Icons from './Icons'
import GetCryptoChartData from '../services/CryptoService'
import dynamic from 'next/dynamic'
import ButtonFavorite from '../components/ButtonFavorite'
import ButtonLegend from '../components/ButtonLegend'

const DetailedChart = dynamic(
	() => {
		return import('../components/DetailedChart')
	},
	{ ssr: false }
)

function DetailedCryptoView(props) {
	function format(x) {
		return Number.parseFloat(x).toFixed(2)
	}

	const [data, setData] = useState(props.data)
	const change = format(((data[0].price - data[0].value) / data[0].value) * 100)

	const [showPrice, setShowPrice] = useState(true)
	const [showChange, setShowChange] = useState(false)
	const [showVolume, setShowVolume] = useState(false)
	const [dateRange, setDateRange] = useState('5D')
	const [interval, setInterval] = useState('15mins')
	const [currency, setCurrency] = useState('USD')

	const [chartData, setChartData] = useState(() => GetCryptoChartData())
	function getDa() {
		return chartData
	}

	function getShowPrice(value) {
		setShowPrice(value)
		console.log(showPrice)
		handleChartChange()
	}
	function getShowChange(value) {
		setShowChange(value)
		console.log(showChange)
		handleChartChange()
	}
	function getShowVolume(value) {
		setShowVolume(value)
		console.log(showVolume)

		handleChartChange()
	}

	function handleChangeDateRange(value) {
		setDateRange(value.target.value)
		handleChartChange()
	}
	function handleChangeInterval(value) {
		setInterval(value.target.value)
		handleChartChange()
	}
	function handleChangeCurrency(value) {
		setCurrency(value.target.value)
		handleChartChange()
	}

	function handleChartChange() {
		// Get function for all parameters
	}

	return (
		<>
			<div className='detailed-crypto-view row'>
				<div className='column'>
					<div className='column detailed-crypto-div'>
						<div className='row h-center'>
							<img
								className='simple-crypto-view-logo'
								src={data[0].abbreviation + '.svg'}
								alt=''
							/>
							<div className='column v-center'>
								<p className='simple-crypto-name'>{data[0].name}</p>
								<p className='simple-crypto-abbreviation'>{data[0].abbreviation}</p>
							</div>
							<ButtonFavorite />
							<a href='' className='button'>
								Compare
							</a>
						</div>
					</div>
					<div className='column detailed-crypto-div'>
						<p className='detailed-crypto-div-title'>Detailed informations:</p>
						<div className='row detailed-crypto-item'>
							<p className='detailed-crypto-item-title'>Price</p>
							<p className='detailed-crypto-item-value'>{data[0].price}</p>
						</div>
						<div className='row detailed-crypto-item'>
							<p className='detailed-crypto-item-title'>24h Change</p>
							<p className='detailed-crypto-item-value'>{8000}</p>
						</div>
						<div className='row detailed-crypto-item'>
							<p className='detailed-crypto-item-title'>24h Volume</p>
							<p className='detailed-crypto-item-value'>{data[0].price}</p>
						</div>
						<div className='row detailed-crypto-item'>
							<p className='detailed-crypto-item-title'>Market cap</p>
							<p className='detailed-crypto-item-value'>{data[0].price}</p>
						</div>
						<div className='row detailed-crypto-item'>
							<p className='detailed-crypto-item-title'>Price</p>
							<p className='detailed-crypto-item-value'>{data[0].price}</p>
						</div>
						<div className='row detailed-crypto-item'>
							<p className='detailed-crypto-item-title'>Price</p>
							<p className='detailed-crypto-item-value'>{data[0].price}</p>
						</div>
						<div className='row detailed-crypto-item'>
							<p className='detailed-crypto-item-title'>Price</p>
							<p className='detailed-crypto-item-value'>{data[0].price}</p>
						</div>
					</div>
					<div className='column detailed-crypto-div'>
						<p className='detailed-crypto-div-title'>Chart&apos;s legend:</p>
						<div className='row detailed-crypto-div'>
							<ButtonLegend
								sendData={getShowPrice}
								value={showPrice}
								name='Price'
								backgroundColor='orange'
							/>
							<ButtonLegend
								sendData={getShowChange}
								value={showChange}
								name='24h change'
								backgroundColor='blue'
							/>
							<ButtonLegend
								sendData={getShowVolume}
								value={showVolume}
								name='24h volume'
								backgroundColor='red'
							/>
						</div>
					</div>
					<div className='row detailed-crypto-div left h-center'>
						<p className='detailed-crypto-div-title'>Chart&apos;s settings:</p>
						<select onChange={handleChangeDateRange} value={dateRange} name='daterange'>
							<optgroup label='Date Range'>
								<option value='1D'>1 D</option>
								<option value='5D'>5 D</option>
								<option value='1M'>1 M</option>
								<option value='3M'>3 M</option>
								<option value='6M'>6 M</option>
								<option value='1Y'>1 Y</option>
								<option value='MAX'>MAX</option>
							</optgroup>
						</select>
						<select onChange={handleChangeInterval} value={interval} name='interval'>
							<optgroup label='Interval'>
								<option value='1min'>1 min</option>
								<option value='2mins'>2 mins</option>
								<option value='5mins'>5 mins</option>
								<option value='15mins'>15 mins</option>
								<option value='30mins'>30 mins</option>
								<option value='1hour'>1 hour</option>
								<option value='4hours'>4 hours</option>
								<option value='1day'>1 day</option>
								<option value='1week'>1 week</option>
								<option value='1month'>1 month</option>
								<option value='1year'>1 year</option>
							</optgroup>
						</select>
					</div>
					<div className='row detailed-crypto-div left h-center'>
						<p className='detailed-crypto-div-title'>Current currency:</p>

						<select onChange={handleChangeCurrency} value={currency} name='currency'>
							<optgroup label='Currency'>
								<option value='USD'>USD</option>
								<option value='CAD'>CAD</option>
								<option value='EURO'>EURO</option>
							</optgroup>
						</select>
					</div>
				</div>
				<DetailedChart getChartDatas={() => GetCryptoChartData()} dateRange={dateRange} />
			</div>
		</>
	)
}

export default DetailedCryptoView
