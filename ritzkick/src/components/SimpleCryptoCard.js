import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import SimpleChart from '@/components/charts/SimpleChart'
import format from 'utils/formatter'
import { isUserConnected } from 'services/AuthService'
import ButtonFavorite from '../components/ButtonFavorite'
import Link from 'next/link'

// <Image src={`/${props.data.fromCurrency}.svg`} alt="" width={50} height={50} />
function SimpleCryptoCard(props) {
	return (
		<>
			<Link href={'/asset/' + props.data.fromCurrency.toString().toLowerCase()}>
				<div className="simple-crypto-card column h-center">
					<div className="row h-center space-between card-row">
						<div className="row h-center left">
							<Image src={`/${props.data.fromCurrency}.svg`} width={25} height={25} />
							<p className="card-title">{props.data.shortName}</p>
							<p className="card-slug">{props.data.fromCurrency}</p>
						</div>
						{!isUserConnected() ? (
							<></>
						) : (
							<ButtonFavorite refresh={props.refresh} slug={props.data.fromCurrency} />
						)}
					</div>
					<div className="row card-row space-between">
						<p className="card-price">{format(props.data.regularMarketPrice)} $</p>
						{props.data.regularMarketChange >= 0 ? (
							<p className="card-price c-green">
								+{format(props.data.regularMarketChangePercent)}% &nbsp; +
								{format(props.data.regularMarketChange)}$
							</p>
						) : (
							<p className="card-price decrease">
								{format(props.data.regularMarketChangePercent)}% &nbsp;{' '}
								{format(props.data.regularMarketChange)}$
							</p>
						)}
					</div>
					{props.chartData ? (
						<SimpleChart data={props.chartData} increase={props.data.regularMarketChange > 0} />
					) : null}
				</div>
			</Link>
		</>
	)
}

export default SimpleCryptoCard
