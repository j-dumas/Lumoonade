import React, { useState, useEffect } from 'react'
import Icons from './Icons'
import ButtonFavorite from '../components/ButtonFavorite'

function DetailedMenu(props) {
	return (
		<div className="detailed-menu space-between row h-center">
			<div className="row h-center detailed-menu-info">
				<img className="detailed-menu-logo" src={'../' + props.firstData[0].fromCurrency + '.svg'} alt="" />
				<h1 className="detailed-menu-title">{props.firstData[0].shortName}</h1>
				<p className="detailed-menu-subtitle">{props.firstData[0].fromCurrency}</p>
				<a className="detailed-chart-legend-button-special" href="test">
					Compare
				</a>
			</div>
			<div className="detailed-menu-actions row h-center">
				<ButtonFavorite />
				<a href="" className="">
					<Icons.Bell />
				</a>
				<a href="" className="detailed-menu-actions-icon">
					<Icons.ArrowUp />
				</a>
				<a href="" className="detailed-menu-actions-icon">
					<Icons.ArrowDown />
				</a>
				<a href="" className="detailed-menu-actions-icon">
					<Icons.Exange />
				</a>
			</div>
		</div>
	)
}

export default DetailedMenu
