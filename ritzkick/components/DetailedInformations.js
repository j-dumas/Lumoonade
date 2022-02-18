import React, { useState, useEffect } from 'react'
import Functions from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'
import format from '../utils/formatter'

function DetailedInformations(props) {
	return (
		<>
			<div className="column detailed-informations detailed-div">
				{props.name ? (
					<div className="detailed-div-name row space-between h-center">
						<img className="detailed-menu-logo" src={'../' + props.data.fromCurrency + '.svg'} alt="" />
						<h1 className="detailed-menu-title">{props.data.shortName}</h1>
						<p className="detailed-menu-subtitle">{props.data.fromCurrency}</p>
					</div>
				) : (
					''
				)}
				<div className="detailed-div-menu row space-between">
					<label className="detailed-div-title">Detailed informations</label>
					<p className="detailed-div-title">$ = {props.data.currency}$</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">Price &nbsp;($)</p>
					<p className="detailed-price">{props.data.regularMarketPrice}</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">24h change</p>
					<p
						className={
							props.data.regularMarketChangePercent >= 0
								? 'detailed-change increase'
								: 'detailed-change decrease'
						}
					>
						{props.data.regularMarketChangePercent >= 0 ? '+' : ''}
						{format(props.data.regularMarketChangePercent)} % &nbsp;&nbsp;
						{props.data.regularMarketChangePercent >= 0 ? '+' : ''}
						{format(props.data.regularMarketChange)} $
					</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">Market cap</p>
					<p className="detailed-div-item-value">{props.data.marketCap} $</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">24h Volume</p>
					<p className="detailed-div-item-value">{props.data.volume24Hr}</p>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">Regular volume</p>
					<p className="detailed-div-item-value">{props.data.regularMarketVolume}</p>
				</div>
			</div>
		</>
	)
}
//
export default DetailedInformations
