import React, { useState, useEffect } from 'react'
import SimpleChart from '@/components/charts/SimpleChart'
import Icons from '@/components/Icons'
import format from '../../../utils/formatter'
import { isUserConnected } from '../../../services/AuthService'
import ButtonFavorite from '../ButtonFavorite'

export default function SimpleCryptoView(props) {
	const [imgLoaded, setImgStatus] = useState(false)

	return (
		<>
			<a href={'/asset/' + props.data.fromCurrency.toString().toLowerCase()} className="simple-crypto-view row center">
				<div className='sub-section row space-between'>
					<div className="simple-crypto-view-item row left h-center">
						<img className="simple-crypto-view-logo" src={props.data.fromCurrency + '.svg'} alt="" />
						<div className="column simple-crypto-names h-center">
							<p className="simple-crypto-name">{props.data.shortName}</p>
							<p className="simple-crypto-abbreviation">{props.data.fromCurrency}</p>
						</div>
					</div>

					{!props.asset?<></>:
					<>
						<p className="simple-crypto-view-item">{props.asset.amount}</p>
						<p className="simple-crypto-view-item">{format(props.asset.totalSpent)}</p>
						<p className="simple-crypto-view-item">
							{format(props.data.regularMarketPrice*props.asset.amount)}
						</p>

						{(props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent) >= 0 ?
						<p className="simple-crypto-view-item simple-crypto-change increase">
							+{format((props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)/props.asset.totalSpent*100)} % &nbsp; +{format(props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)} $
						</p>
						:
						<p className="simple-crypto-view-item simple-crypto-change decrease">
							{format((props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)/props.asset.totalSpent*100)} % &nbsp; {format(props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)} $
						</p>}
					</>
					}
					<p className="simple-crypto-view-item simple-crypto-price">{format(props.data.regularMarketPrice)}</p>

					{props.data.regularMarketChange >= 0 ?
					<p className="simple-crypto-view-item simple-crypto-change increase">
						+{format(props.data.regularMarketChangePercent)} % &nbsp; +{format(props.data.regularMarketChange)} $
					</p>
					:
					<p className="simple-crypto-view-item simple-crypto-change decrease">
						{format(props.data.regularMarketChangePercent)} % &nbsp; {format(props.data.regularMarketChange)} $
					</p>}

					{!props.chartData ?<></>:
					<SimpleChart data={props.chartData} increase={props.data.regularMarketChange > 0}/>}

					{!isUserConnected()? <></> :
					<ButtonFavorite slug={props.data.fromCurrency.toString().toLowerCase()}/>}
				</div>
			</a>
		</>
	)
}
