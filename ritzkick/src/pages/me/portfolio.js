import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import PieChart from '../../components/charts/PieChart'
import { getUserDashboardData } from '../../../services/dashboard-service'
import { isUserConnected } from '../../../services/AuthService'
import DetailedChart from '../../components/charts/DetailedChart'
import {createSocket} from '../../../services/SocketService'
import SimpleWalletAssetDashboard from '../../components/SimpleWalletAssetDashboard'
import SimpleCryptoDashboard from '../../components/SimpleCryptoDashboard'
import { SlugArrayToSymbolArray, AreSlugsEqual } from '../../../utils/crypto'
import Icons from '../../components/Icons'
import format from '../../../utils/formatter'

const CURRENCY = 'usd'

const Dashboard = () => {
	const router = useRouter()
	const [socket, setSocket] = useState()
	const [slug, setSlug] = useState('btc-cad')
	const [dateRange, setDateRange] = useState('1d')
	const [interval, setInterval] = useState('1h')
	const [assets, setAssets] = useState()
	const [portfolioValue, setPortfolioValue] = useState(0)
	const [portfolioChange, setPortfolioChange] = useState(0)
	useEffect(async () => {
		let userData = await getUserDashboardData()
		console.log(userData.assets)
		setAssets(userData.assets)
		let slugs =[]
		userData.assets.map((asset) => {
			slugs.push(asset.name)
		})
		let symbols = SlugArrayToSymbolArray(slugs, CURRENCY, false)
		setSocket(createSocket(['general', `graph-${dateRange}-${interval}`], symbols, `wss://${window.location.host}`))
	}, [])

	useEffect(() => {
		if (!socket || !assets) return
		socket.on('data', (datas) => {
			
			let value = 0
			let change = 0
			datas.forEach((data) => {
				assets.forEach((asset) => {
					if (AreSlugsEqual(data.fromCurrency, asset.name)) {
						value += (data.regularMarketPrice*asset.amount)
						change += (data.regularMarketChangePercent)
					}
				})
			})
			setPortfolioChange(format(change/assets.length))
			setPortfolioValue(format(value))
		})
	}, [socket, assets])

	

	return (
		!socket || !assets ? <></> :
		<>
			<section className="section column principal first center">
				<section className="sub-section column">

					<div className="page-menu space-between row h-center">
						<div className="row h-center detailed-menu-info">
							<h1 className="detailed-menu-title">Portfolio</h1>
							<p className="detailed-menu-subtitle">${portfolioValue}</p>
							{portfolioChange>=0?
								<p className="detailed-menu-subtitle increase">+{portfolioChange}% <span className='small-p'>(24h)</span></p>
								:
								<p className="detailed-menu-subtitle decrease">{portfolioChange}% <span className='small-p'>(24h)</span></p>
							}
							
						</div>
						<div className="detailed-menu-actions row h-center">
							<a href="" className="detailed-menu-actions-icon">
								<Icons.ArrowUp />
							</a>
							<a href="" className="detailed-menu-actions-icon">
								<Icons.ArrowDown />
							</a>
							<a href="" className="detailed-menu-actions-icon">
								<Icons.Exange />
							</a>
						</div>
					</div>

					<div className='row space-between'>
						<PieChart socket={socket} assets={assets}/>
						<DetailedChart socket={socket} slug={slug} wallet={true}/>
					</div>
					<SimpleWalletAssetDashboard socket={socket} assets={assets}/>
					<SimpleCryptoDashboard socket={socket}/>
				</section>
			</section>
		</>
	)
}
//<PieChart socket={socket}/>
Dashboard.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.compare.title'),
				description: t('pages.compare.description')
			}}
		>
			{page}
		</Layout>
	)
}

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'dashboard', 'crypto']))
		}
	}
}

export default Dashboard
