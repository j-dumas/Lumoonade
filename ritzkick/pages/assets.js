import React, { useState } from 'react'

import Layout from '../components/Layout'
import dynamic from 'next/dynamic'

const SimpleCryptoCard = dynamic(() => import('../components/SimpleCryptoCard'))

const Assets = () => {
	const [data, setData] = useState([]) // GetTopPopularCryptocurrencies()

	return (
		<div>
			<section className="section row center principal first">
				{/* {data.map((element, i) => {
					return (
						<div key={element}>
							<SimpleCryptoCard data={element} />
						</div>
					)
				})} */}
			</section>
		</div>
	)
}

Assets.getLayout = function getLayout(page) {
	return (
		<Layout
			pageMeta={{
				title: 'CRYPTOOL | ASSETS',
				description: 'Cryptool assets page'
			}}
		>
			{page}
		</Layout>
	)
}

export default Assets
