import React, { useState, useEffect } from 'react'
import format from 'utils/formatter'
import Image from 'next/image'

import { useTranslation } from 'next-i18next'
import Image from 'next/image'

const DetailedInformations = (props) => {
	const { t } = useTranslation('crypto')

	return (
		<div className="row space-between detailed-informations detailed-div">
			{props.name ? (
				<div className="detailed-div-name row space-between h-center">
					<Image src={'/' + props.data.fromCurrency + '.svg'} width={30} height={30} />
					<h1 className="detailed-menu-title">{props.data.shortName}</h1>
					<p className="detailed-menu-subtitle">{props.data.fromCurrency}</p>
				</div>
			) : (
				''
			)}
			<div className="detailed-div-menu row space-between w-100">
				<label className="detailed-div-title">{t('detailed.title')}</label>
				<p className="detailed-div-title">$ = {props.data.currency}$</p>
			</div>
			<div className="row space-between detailed-div-item">
				<p className="detailed-div-item-label">{t('detailed.price')}</p>
				<p className="detailed-price">{format(props.data.regularMarketPrice)}</p>
			</div>
			<div className="row space-between detailed-div-item-big">
				<p className="detailed-div-item-label">{t('detailed.change')}</p>
				<p
					className={
						props.data.regularMarketChangePercent >= 0
							? 'detailed-change increase'
							: 'detailed-change decrease'
					}
				>
					{props.data.regularMarketChangePercent >= 0 ? '+' : ''}
					{format(props.data.regularMarketChangePercent)}% &nbsp;&nbsp;
					{props.data.regularMarketChangePercent >= 0 ? '+$' : ''}
					{format(props.data.regularMarketChange)}
				</p>
			</div>
			<div className="row space-between detailed-div-item">
				<p className="detailed-div-item-label">{t('detailed.market-cap')}</p>
				<p className="detailed-div-item-value">${format(props.data.marketCap, false)}</p>
			</div>
			<div className="row space-between detailed-div-item">
				<p className="detailed-div-item-label">{t('detailed.volume.24h')}</p>
				<p className="detailed-div-item-value">{format(props.data.volume24Hr, false)}</p>
			</div>
			<div className="row space-between detailed-div-item">
				<p className="detailed-div-item-label">{t('detailed.volume.regular')}</p>
				<p className="detailed-div-item-value">{format(props.data.regularMarketVolume, false)}</p>
			</div>
		</div>
	)
}

export default DetailedInformations
