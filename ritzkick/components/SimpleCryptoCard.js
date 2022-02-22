import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SimpleChart from './SimpleChart'
import format from '../utils/formatter'

//const chart = chartReference.current
//if (!chart || isDataNull(datas)) return
//chart.data = getRelativeChartData(datas)
//chart.update()

function SimpleCryptoCard(props) {
	const [data] = useState(props.data)
	
	return (
		<>
			<a href={'asset/' + data.fromCurrency.toString().toLowerCase()} className="simple-crypto-card column h-center">
				<div className="row h-center">
					<Image src={`/${data.fromCurrency}.svg`} alt="" width={50} height={50} />
					<p className="simple-crypto-name">{data.shortName}</p>
					<p className="simple-crypto-abbreviation">{data.fromCurrency}</p>
				</div>
				<div className="row">
					<p className="simple-crypto-view-item simple-crypto-price">{format(data.regularMarketPrice)} $</p>
					{data.regularMarketChange >= 0 ?
					<>
						<p className='simple-crypto-view-item simple-crypto-change c-green'>
							+{format(data.regularMarketChangePercent)} %
						</p>
						<p className='simple-crypto-view-item simple-crypto-change c-green'>
							+{format(data.regularMarketChange)} $
						</p>
					</>
					:
					<>
						<p className='simple-crypto-view-item simple-crypto-change decrease'>
							{format(data.regularMarketChangePercent)} %
						</p>
						<p className='simple-crypto-view-item simple-crypto-change decrease'>
							{format(data.regularMarketChange)} $
						</p>
					</>}
				</div>
				{props.chartData?
					<SimpleChart data={props.chartData} increase={data.regularMarketChange > 0}/>
				:null}
			</a>
		</>
	)
}

export default SimpleCryptoCard