import React, { useEffect, useState } from 'react'
import Icons from '@/components/Icons'
import ButtonFavorite from '@/components/ButtonFavorite'
import Image from 'next/image'
import { isUserConnected } from '../../../services/AuthService'
import ProfileAddAlerts from '../ProfileAddAlerts'

import WalletDeposit from '../../components/wallet/deposit'
import WalletWithdraw from '../../components/wallet/withdraw'

import { useTranslation } from 'next-i18next'

function DetailedMenu(props) {
	const { t } = useTranslation('detailedmenu')

	const [withdraw, setWithdraw] = useState(false)
	const openWithdraw = () => setWithdraw(true)
	const closeWithdraw = () => setWithdraw(false)

	const [deposit, setDeposit] = useState(false)
	const openDeposit = () => setDeposit(true)
	const closeDeposit = () => setDeposit(false)

	return (
		<div className="page-menu space-between row h-center">
			<div className="row h-center detailed-menu-info">
				<Image src={`/../${props.firstData[0].fromCurrency}.svg`} alt="" width={40} height={40} />
				<h1 className="detailed-menu-title">{props.firstData[0].shortName}</h1>
				<p className="detailed-menu-subtitle">{props.firstData[0].fromCurrency}</p>
				<a
					className="detailed-chart-legend-button-special"
					href={'/compare?assets=' + props.firstData[0].fromCurrency}
				>
					{t('compare')}
				</a>
			</div>

			{!isUserConnected() ? (
				<></>
			) : (
				<div id="alerts-header" className="detailed-menu-actions row h-center">
					<ButtonFavorite slug={props.slug} />
					<ProfileAddAlerts slug={props.slug} provenance={true} />
					<div onClick={openWithdraw} className="detailed-menu-actions-icon">
						<Icons.ArrowUp />
					</div>
					<WalletWithdraw default={props.firstData[0].fromCurrency} isOpen={withdraw} close={closeWithdraw} />
					<div onClick={openDeposit} className="detailed-menu-actions-icon">
						<Icons.ArrowDown />
					</div>
					<WalletDeposit default={props.firstData[0].fromCurrency} isOpen={deposit} close={closeDeposit} />
				</div>
			)}
		</div>
	)
}

export default DetailedMenu
