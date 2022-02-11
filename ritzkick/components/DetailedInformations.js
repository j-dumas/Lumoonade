import React, { useState, useEffect } from 'react'
import Functions from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'

function DetailedInformations(props) {
	function format(x) {
		return Number.parseFloat(x).toFixed(2)
	}

	const [data, setData] = useState(props.firstData)
	useEffect(async () => {
		//setData(await Functions.GetCryptocurrencyInformationsBySlug(props.slug))
		props.socket.on('priceChange', (data) => {
			setData([data])
		})
		if (props.socket) return () => socket.disconnect()
	}, [])

	return !data ? (
		<>Loading...</>
	) : (
		<>
			<div className="column detailed-informations detailed-div">
				<div className="detailed-div-menu row space-between">
					<label className="detailed-div-title">Detailed informations</label>
					<p className="detailed-div-title">$ = {data[0].currency}$</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">Price &nbsp;($)</p>
					<p className="detailed-price">{data[0].regularMarketPrice}</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">24h change</p>
					<p
						className={
							data[0].regularMarketChangePercent >= 0
								? 'detailed-change increase'
								: 'detailed-change decrease'
						}
					>
						{data[0].regularMarketChangePercent >= 0 ? '+' : ''}
						{format(data[0].regularMarketChangePercent)} % &nbsp;&nbsp;
						{data[0].regularMarketChangePercent >= 0 ? '+' : ''}
						{format(data[0].regularMarketChange)} $
					</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">Market cap</p>
					<p className="detailed-div-item-value">{data[0].marketCap} $</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">24h Volume</p>
					<p className="detailed-div-item-value">{data[0].volume24Hr}</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">Regular volume</p>
					<p className="detailed-div-item-value">{data[0].regularMarketVolume}</p>
				</div>
			</div>
		</>
	)
}
//
export default DetailedInformations
