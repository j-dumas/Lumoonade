import React, { useState, useEffect } from 'react'
import Icons from '@/components/Icons'
import ButtonFavorite from '@/components/ButtonFavorite'
import Image from 'next/image'
import { AreSlugsEqual } from '../../../utils/crypto'
import format from '../../../utils/formatter'

import WalletDeposit from '../../components/wallet/deposit'
import WalletWithdraw from '../../components/wallet/withdraw'

function PortfolioMenu(props) {
	const [portfolioValue, setPortfolioValue] = useState(0)
	const [portfolioChange, setPortfolioChange] = useState([0,0])

	const [withdraw, setWithdraw] = useState(false)
	const openWithdraw = () => setWithdraw(true)
	const closeWithdraw = () => setWithdraw(false)

	const [deposit, setDeposit] = useState(false)
	const openDeposit = () => setDeposit(true)
	const closeDeposit = () => setDeposit(false)

	useEffect(() => {
		if (!props.socket || !props.assets) return
		props.socket.on('data', (datas) => {
			let value = 0
			let change = 0
			datas.forEach((data) => {
				props.assets.forEach((asset) => {
					if (AreSlugsEqual(data.fromCurrency, asset.name)) {
						value += (data.regularMarketPrice*asset.amount)
						change += (data.regularMarketChangePercent)
					}
				})
			})
			let c = (value*(change/props.assets.length/100<0)? -1*value*(change/props.assets.length/100):value*(change/props.assets.length/100))
			setPortfolioChange([format(change/props.assets.length), format(c)])
			setPortfolioValue(format(value))
		})
	}, [])

	return (
		<div className="page-menu space-between row h-center">
			<div className="row h-center detailed-menu-info">
				<h1 className="detailed-menu-title">Portfolio</h1>
				<p className="detailed-menu-subtitle">${portfolioValue}</p>
				{portfolioChange>=0?
					<p className="detailed-menu-subtitle increase">+{portfolioChange[0]}% &nbsp; +${portfolioChange[1]}<span className='small-p'> (24h)</span></p>
					:
					<p className="detailed-menu-subtitle decrease">{portfolioChange[0]}% &nbsp; -${(portfolioChange[1])}<span className='small-p'> (24h)</span></p>
				}
				
			</div>
			<div className="detailed-menu-actions row h-center">
				<div onClick={openWithdraw} className="detailed-menu-actions-icon">
					<Icons.ArrowUp />
				</div>
				<WalletWithdraw isOpen={withdraw} close={closeWithdraw}/>
				<div onClick={openDeposit} className="detailed-menu-actions-icon">
					<Icons.ArrowDown />
				</div>
				<WalletDeposit isOpen={deposit} close={closeDeposit}/>
			</div>
		</div>
	)
}

export default PortfolioMenu
