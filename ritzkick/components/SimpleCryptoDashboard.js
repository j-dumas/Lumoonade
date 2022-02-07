import React, { useState, useEffect } from 'react'
import SimpleCryptoView from './SimpleCryptoView'

function SimpleCryptoDashboard(props) {
	const [data, setData] = useState(props.data)

	return (
		<>
			<div className='simple-crypto-dashboard column v-center'>
				<div className='simple-crypto-view row space-between h-center'>
					<div className='simple-crypto-view-item row left h-center'>
						<p className='simple-crypto-name'>Asset</p>
						<div className='column simple-crypto-names'>
							<p className='simple-crypto-name'></p>
							<p className='simple-crypto-abbreviation'></p>
						</div>
					</div>
					<p className='simple-crypto-view-item simple-crypto-price'>Price</p>
					<p className='simple-crypto-view-item simple-crypto-change c-white'>
						24h Change
					</p>
					<p className='simple-chart'></p>
					<p className='icon'></p>
				</div>
				{data.map((element, i) => {
					return (
						<>
							<SimpleCryptoView data={element} />
						</>
					)
				})}
			</div>
		</>
	)
}

export default SimpleCryptoDashboard
