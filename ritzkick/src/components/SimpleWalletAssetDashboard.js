import React, { useState, useEffect } from 'react'
import SimpleWalletAssetView from '@/components/views/SimpleWalletAssetView'
import {isUserConnected} from '../../services/AuthService'
import {AreSlugsEqual} from '../../utils/crypto'

function SimpleWalletAssetDashboard(props) {
	const [datas, setDatas] = useState([])

	useEffect(() => {
		if (!props.socket) return
		props.socket.on('data', (data) => {
			setDatas(data)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	return !datas || !props.socket? (
		<>Loading...</>
	) : (
		<>
			<div className="simple-crypto-dashboard v-center">
				<div className="simple-crypto-dashboard-menu row center">
					<div className='sub-section row space-between'>
						<div className="simple-crypto-view-item-big row left h-center">
                            <p>Asset</p>
						</div>
                        <p className="simple-crypto-view-item">Market price</p>
                        <p className="simple-crypto-view-item">Amount</p>
                        <p className="simple-crypto-view-item">Total spent</p>
                        <p className="simple-crypto-view-item-big simple-crypto-change">Change</p>
                        <p className="simple-crypto-view-item-big">Value</p>
					</div>
				</div>
				{datas.map((element, i) => {
                    let data = datas.find((el) => {
                        return AreSlugsEqual(el.fromCurrency.toString().toUpperCase(), element.symbol.toString().toUpperCase())
                    })
					let asset = props.assets.find((el) => {
                        return AreSlugsEqual(el.name.toString().toUpperCase(), element.symbol.toString().toUpperCase())
                    })
	
					return <SimpleWalletAssetView data={data} asset={asset} key={element.fromCurrency}/>
				})}
			</div>
		</>
	)
}

export default SimpleWalletAssetDashboard
