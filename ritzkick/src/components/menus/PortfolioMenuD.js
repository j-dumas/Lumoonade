import React, { useState, useEffect } from 'react'
import Icons from '@/components/Icons'
import { AreSlugsEqual } from '../../../utils/crypto'
import format from '../../../utils/formatter'

import WalletDeposit from '../../components/wallet/deposit'
import WalletWithdraw from '../../components/wallet/withdraw'

function PortfolioMenuD(props) {
	const [withdraw, setWithdraw] = useState(false)
	const openWithdraw = () => setWithdraw(true)
	const closeWithdraw = () => setWithdraw(false)

	const [deposit, setDeposit] = useState(false)
	const openDeposit = () => setDeposit(true)
	const closeDeposit = () => setDeposit(false)

	return (
		<div className="page-menu space-between row h-center">
			<div className="row h-center detailed-menu-info">
				<h1 className="detailed-menu-title">Portfolio</h1>
				<p className="detailed-menu-subtitle">${0}</p>	
				<p className="detailed-menu-subtitle increase">
					{0}% &nbsp; -${0}
					<span className="small-p"> (24h)</span>
				</p>
			</div>
			<div className="detailed-menu-actions row h-center">
				<div onClick={openWithdraw} className="detailed-menu-actions-icon">
					<Icons.ArrowUp />
				</div>
				<WalletWithdraw isOpen={withdraw} close={closeWithdraw} refresh={true} />
				<div onClick={openDeposit} className="detailed-menu-actions-icon">
					<Icons.ArrowDown />
				</div>
				<WalletDeposit isOpen={deposit} close={closeDeposit} refresh={true} />
			</div>
		</div>
	)
}

export default PortfolioMenuD
