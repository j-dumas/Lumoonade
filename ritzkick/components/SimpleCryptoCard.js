import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SimpleChart from './charts/SimpleChart'
import format from '../utils/formatter'

//const chart = chartReference.current
//if (!chart || isDataNull(datas)) return
//chart.data = getRelativeChartData(datas)
//chart.update()

function SimpleCryptoCard(props) {
	
	return (
		<>
			<a href={'asset/' + props.data.fromCurrency.toString().toLowerCase()} className="simple-crypto-card column h-center">
				<div className="row h-center">
					<Image src={`/${props.data.fromCurrency}.svg`} alt="" width={50} height={50} />
					<p className="simple-crypto-name">{props.data.shortName}</p>
					<p className="simple-crypto-abbreviation">{props.data.fromCurrency}</p>
				</div>
				<div className="row">
					<p className="simple-crypto-view-item simple-crypto-price">{format(props.data.regularMarketPrice)} $</p>
					{props.data.regularMarketChange >= 0 ?
					<>
						<p className='simple-crypto-view-item simple-crypto-change c-green'>
							+{format(props.data.regularMarketChangePercent)} %
						</p>
						<p className='simple-crypto-view-item simple-crypto-change c-green'>
							+{format(props.data.regularMarketChange)} $
						</p>
					</>
					:
					<>
						<p className='simple-crypto-view-item simple-crypto-change decrease'>
							{format(props.data.regularMarketChangePercent)} %
						</p>
						<p className='simple-crypto-view-item simple-crypto-change decrease'>
							{format(props.data.regularMarketChange)} $
						</p>
					</>}
				</div>
				{props.chartData?
					<SimpleChart data={props.chartData} increase={props.data.regularMarketChange > 0}/>
				:null}
			</a>
		</>
	)
}

export default SimpleCryptoCard