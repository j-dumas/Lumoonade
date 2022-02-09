import React, { useState, useEffect } from 'react'
import SimpleChart from './SimpleChart'
import Icons from './Icons'

function SimpleCryptoView(props) {
	function format(x) {
		return Number.parseFloat(x).toFixed(2)
	}

	const [data, setData] = useState(props.data)

	const change = data.regularMarketChangePercent  //format(((data.price - data.value[0]) / data.value[0]) * 100)

	return (
		<>
			<a
				href={'assets/' + data.fromCurrency}
				className='simple-crypto-view row space-between h-center'
			>
				<div className='simple-crypto-view-item row left h-center'>
					<img
						className='simple-crypto-view-logo'
						src={data.fromCurrency + '.svg'}
						alt=''
					/>
					<div className='column simple-crypto-names'>
						<p className='simple-crypto-name'>{data.shortName.split(' ')[0]}</p>
						<p className='simple-crypto-abbreviation'>{data.fromCurrency}</p>
					</div>
				</div>
				<p className='simple-crypto-view-item simple-crypto-price'>{data.regularMarketPrice}</p>
				<p
					className={
						change > 0
							? 'simple-crypto-view-item simple-crypto-change c-green'
							: change == 0
							? 'simple-crypto-view-item simple-crypto-change c-white'
							: 'simple-crypto-view-item simple-crypto-change c-red'
					}
				>
					{change} %
				</p>
				
				<Icons.StarEmpty />
			</a>
		</>
	)
}
// <SimpleChart data={data} />
export default SimpleCryptoView
