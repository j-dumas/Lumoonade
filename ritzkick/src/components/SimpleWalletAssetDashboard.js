import React, { useState, useEffect } from 'react'
import SimpleWalletAssetView from '@/components/views/SimpleWalletAssetView'
import { AreSlugsEqual } from 'utils/crypto'
import { useTranslation } from 'next-i18next'

function SimpleWalletAssetDashboard(props) {
	const { t } = useTranslation('portfolio')

	const [datas, setDatas] = useState([])

	useEffect(() => {
		if (!props.socket) return
		props.socket.on('data', (data) => {
			setDatas(data)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	return !datas || !props.socket ? (
		<>Loading...</>
	) : (
		<>
			<div className="simple-crypto-dashboard v-center">
				<div className="simple-crypto-dashboard-menu row center">
					<div className="sub-section row space-between">
						<div className="row simple-crypto-view-div">
							<div className="simple-crypto-view-item-big row left h-center">
								<p>Asset</p>
							</div>
							<p className="simple-crypto-view-item">{t('dashboard.market')}</p>
						</div>
						<div className="row simple-crypto-view-div">
							<p className="simple-crypto-view-item">{t('dashboard.amount')}</p>
							<p className="simple-crypto-view-item">{t('dashboard.total')}</p>
						</div>
						<div className="row simple-crypto-view-div">
							<p className="simple-crypto-view-item-big simple-crypto-change">{t('dashboard.change')}</p>
							<p className="simple-crypto-view-item">{t('dashboard.value')}</p>
						</div>
					</div>
				</div>
				{datas.map((element) => {
					let data = datas.find((el) => {
						return AreSlugsEqual(
							el.fromCurrency.toString().toUpperCase(),
							element.symbol.toString().toUpperCase()
						)
					})
					let asset = props.assets.find((el) => {
						return AreSlugsEqual(el.name.toString().toUpperCase(), element.symbol.toString().toUpperCase())
					})

					return <SimpleWalletAssetView data={data} asset={asset} key={element.fromCurrency} />
				})}
			</div>
		</>
	)
}

export default SimpleWalletAssetDashboard
