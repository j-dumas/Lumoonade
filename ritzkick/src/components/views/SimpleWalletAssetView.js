import React, { useState, useEffect } from 'react'
import SimpleChart from '@/components/charts/SimpleChart'
import Icons from '@/components/Icons'
import format from '../../../utils/formatter'
import { isUserConnected } from '../../../services/AuthService'
import ButtonFavorite from '../ButtonFavorite'
import Image from 'next/image'

function SimpleCryptoView(props) {
	const [changePercent] = useState(() => {
		let number =
			((props.data.regularMarketPrice * props.asset.amount - props.asset.totalSpent) / props.asset.totalSpent) *
			100
		if (isNaN(number)) return 0
		return number
	})
	const [changeNumber] = useState(props.data.regularMarketPrice * props.asset.amount - props.asset.totalSpent)
	return (
		<div className="simple-crypto-view row center">
			<div className="sub-section row space-between h-center">
				<div className="row simple-crypto-view-div">
					<div className="simple-crypto-view-item-big row left h-center">
						<Image src={'/' + props.data.fromCurrency + '.svg'} width={25} height={25}></Image>
						<p>{props.data.shortName}</p>
					</div>
					<p className="simple-crypto-view-item c-font-2">$ {format(props.data.regularMarketPrice)}</p>
				</div>
				<div className="row simple-crypto-view-div">
					<p className="simple-crypto-view-item">
						{format(props.asset.amount)} {props.asset.name.toString().toUpperCase()}
					</p>
					<p className="simple-crypto-view-item">$ {format(props.asset.totalSpent)}</p>
				</div>
				<div className="row simple-crypto-view-div">
					{changeNumber >= 0 ? (
						<p className="simple-crypto-view-item-big increase">
							+{format(changePercent)}% &nbsp; +{format(changeNumber)}$
						</p>
					) : (
						<p className="simple-crypto-view-item-big decrease">
							{format(changePercent)}% &nbsp; {format(changeNumber)}$
						</p>
					)}

					<p className="simple-crypto-view-item">
						$ {format(props.data.regularMarketPrice * props.asset.amount)}
					</p>
				</div>
			</div>
		</div>
	)
}
export default SimpleCryptoView
