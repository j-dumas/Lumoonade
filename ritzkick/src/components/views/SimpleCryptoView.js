import React from 'react'
import SimpleChart from '@/components/charts/SimpleChart'
import format from '../../../utils/formatter'
import { isUserConnected } from '../../../services/AuthService'
import ButtonFavorite from '../ButtonFavorite'
import Image from 'next/image'
import Link from 'next/link'

export default function SimpleCryptoView(props) {
	return (
		<Link href={'/asset/' + props.data.fromCurrency.toString().toLowerCase()}>
			<div className="simple-crypto-view row center">
				<div className="sub-section row space-between h-center">
					<div className="simple-crypto-view-item-big row left h-center">
						<Image src={'/' + props.data.fromCurrency + '.svg'} width={25} height={25}></Image>
						<p>{props.data.shortName}</p>
					</div>

					<p className="simple-crypto-view-item">{props.data.fromCurrency}</p>

					<p className="simple-crypto-view-item">{format(props.data.regularMarketPrice)}</p>

					{props.data.regularMarketChange >= 0 ? (
						<p className="simple-crypto-view-item-big increase">
							+{format(props.data.regularMarketChangePercent)} % &nbsp; +
							{format(props.data.regularMarketChange)} $
						</p>
					) : (
						<p className="simple-crypto-view-item-big decrease">
							{format(props.data.regularMarketChangePercent)} % &nbsp;{' '}
							{format(props.data.regularMarketChange)} $
						</p>
					)}

					{!props.chartData ? (
						<></>
					) : (
						<SimpleChart data={props.chartData} increase={props.data.regularMarketChange > 0} />
					)}

					{!isUserConnected() ? (
						<></>
					) : (
						<ButtonFavorite slug={props.data.fromCurrency.toString().toLowerCase()} />
					)}
				</div>
			</div>
		</Link>
	)
}
