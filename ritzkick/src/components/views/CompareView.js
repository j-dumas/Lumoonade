import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Icons from '../Icons'
import Functions, {
	GetCryptocurrencyInformationsBySlug,
	GetTopPopularCryptocurrencies,
	GetTopEfficientCryptocurrencies
} from '../../../services/CryptoService'
import ButtonFavorite from '../ButtonFavorite'
import DetailedInformationsDashboard from '../DetailedInformationsDashboard'
import DetailedChart from '../charts/DetailedChart'
import CompareMenu from '../menus/CompareMenu'
import { useRouter } from 'next/router'

const io = require('socket.io-client')

const CompareView = (props) => {
	const router = useRouter()
	const [slug, setSlug] = useState('BTC' + '-' + props.currency)
	const [firstData, setFirstData] = useState()
	const [compareList, setCompareList] = useState(getFirstCompareList())

	const [dateRange, setDateRange] = useState('5d')
	const [interval, setInterval] = useState('15m')
	const connectionUrl = `${process.env.NEXT_PUBLIC_SSL == 'false' ? 'ws' : 'wss'}://${
		process.env.NEXT_PUBLIC_HTTPS
	}:${process.env.NEXT_PUBLIC_PORT}/`
	const [socket, setSocket] = useState()

	useEffect(() => {
		setSocket(
			io(connectionUrl, {
				auth: {
					rooms: ['general', `graph-${dateRange}-${interval}`],
					query: compareList,
					graph: true
				}
			})
		)
	}, [])

	function getFirstCompareList() {
		let paramsString = router.asPath.toString().split('/compare?assets=')[1]
		if (!paramsString) return []
		let params = paramsString.split('-')
		params.map((param, i) => {
			params[i] = param + '-' + props.currency
		})

		return params
	}

	useEffect(async () => {
		// TODO: Fonction à changer pour retourner plusieurs datas.
		setFirstData(await Functions.GetCryptocurrencyInformationsBySlug(slug))
	}, [compareList])

	// Validation:
	if (!props.currency) return <div>Impossible action.</div>

	return !firstData || !socket ? (
		<p>Loading...</p>
	) : (
		<div className="detailed-crypto-view column">
			<div className="page-menu space-between row h-center">
				<div className="row h-center detailed-menu-info">
					<h1 className="detailed-menu-title">Compare</h1>
				</div>
			</div>
			<div className="row space-between">
				<div className="column">
					<CompareMenu
						socket={socket}
						compareList={compareList}
						setCompareList={setCompareList}
						currency={props.currency}
					/>
					<div className="column detailed-informations detailed-div max-width">
						<div className="detailed-div-menu row space-between">
							<p>Titre</p>
							<p>Lorem</p>
						</div>
					</div>
				</div>
				<DetailedChart socket={socket} slug={slug} />
			</div>
			<DetailedInformationsDashboard socket={socket} currency={props.currency} name={true} />
		</div>
	)
}
export default CompareView
