import React, { useState, useEffect } from 'react'
import DetailedInformationsDashboard from '@/components/DetailedInformationsDashboard'
import DetailedChart from '@/components/charts/DetailedChart'
import CompareMenu from '@/components/menus/CompareMenu'
import { useRouter } from 'next/router'
import { createSocket } from 'services/SocketService'
import { useTranslation } from 'next-i18next'
import { isUserConnected } from 'services/AuthService'
import Link from 'next/link'

const CompareView = (props) => {
	const { t } = useTranslation('compare')

	const router = useRouter()
	const [slug] = useState('Dummy' + '-' + props.currency)
	const [compareList, setCompareList] = useState(getFirstCompareList())
	const [userConnected, setUserConnected] = useState(false)

	const [dateRange] = useState('5d')
	const [interval] = useState('15m')
	const [socket, setSocket] = useState()

	useEffect(() => {
		setSocket(
			createSocket(['general', `graph-${dateRange}-${interval}`], compareList, `wss://${window.location.host}/`)
		)
		setUserConnected(isUserConnected())
	}, [compareList, dateRange, interval])

	function getFirstCompareList() {
		let paramsString = router.asPath.toString().split('/compare?assets=')[1]
		if (!paramsString) return []
		let params = paramsString.split('-')
		params.map((param, i) => {
			params[i] = param + '-' + props.currency
		})

		return params
	}

	// Validation:
	if (!props.currency) return <div>Impossible action.</div>

	return !socket ? (
		<p>Loading...</p>
	) : (
		<div className="detailed-crypto-view column">
			<div className="page-menu space-between row h-center">
				<div className="row h-center detailed-menu-info">
					<h1 className="detailed-menu-title">{t('title')}</h1>
				</div>
			</div>
			<div className="column">
				<div className="row space-between">
					<CompareMenu
						socket={socket}
						compareList={compareList}
						setCompareList={setCompareList}
						currency={props.currency}
					/>
					<div className="column detailed-informations detailed-div w-45">
						<div className="detailed-div-menu row space-between">
							<p className="detailed-div-title">Alertes</p>
							<p className="detailed-div-title"></p>
						</div>
						<div className="column center">
							{userConnected ? (
								<p>Cette fonctionnalité n&apos;a pas encore été implémentée.</p>
							) : (
								<>
									<p>Vous devez vous connecter pour accéder cette fonctionnalité.</p>
									<div className="row space-between">
										<div className="button">
											<Link href="/login">Connexion</Link>
										</div>
										<div className="button">
											<Link href="/register">Inscription</Link>
										</div>
									</div>
								</>
							)}
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
