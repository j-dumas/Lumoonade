import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SimpleChart from './SimpleChart'
import Icons from './Icons'

function SimpleCryptoView(props) {
	function format(x) {
		return Number.parseFloat(x).toFixed(2)
	}

	const [data, setData] = useState(props.data)

	const change = format(((data.price - data.value[0]) / data.value[0]) * 100)

	return (
		<>
			<a
				href={'assets/' + data.abbreviation}
				className='simple-crypto-view row space-between h-center'
			>
				<div className='simple-crypto-view-item row left h-center'>
					<Image src={`/${data.abbreviation}.svg`} alt='' width={50} height={50} />
					<div className='column simple-crypto-names'>
						<p className='simple-crypto-name'>{data.name}</p>
						<p className='simple-crypto-abbreviation'>{data.abbreviation}</p>
					</div>
				</div>
				<p className='simple-crypto-view-item simple-crypto-price'>{data.price}</p>
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
				<SimpleChart data={data} />
				<Icons.StarEmpty />
			</a>
		</>
	)
}

export default SimpleCryptoView
