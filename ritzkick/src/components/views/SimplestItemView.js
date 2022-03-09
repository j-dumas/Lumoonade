import React, { useState, useEffect } from 'react'
import GetColorBySlug from 'utils/color'
import Icons from '@/components/Icons'
import format from 'utils/formatter'

function SimplestItemView(props) {
	const color = GetColorBySlug(props.slug)
	function handleClick() {
		props.command(props.slug)
	}

	return (
		<>
			<div className="dynamic-list-item compare-item space-between row h-center">
				{!props.data.fromCurrency ? (
					<div className="c-font-2">Loading...</div>
				) : (
					<>
						<div className="row h-center" style={{ gap: '5px' }}>
							<div className="circle" style={{ backgroundColor: color }}></div>
							<p style={{ fontWeight: 'bold' }}>{props.data.fromCurrency}</p>
						</div>
						<p>${format(props.data.regularMarketPrice)}</p>
						<div
							className={
								props.data.regularMarketChangePercent >= 0
									? 'detailed-change increase row'
									: 'detailed-change decrease row'
							}
						>
							<p>
								{format(props.data.regularMarketChange)}$ &nbsp;{' '}
								{format(props.data.regularMarketChangePercent)}%
							</p>
						</div>
						<div className="c-font-2" onClick={handleClick}>
							<Icons.Times />
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default SimplestItemView
