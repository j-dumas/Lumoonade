import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/layouts/Layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { getUserDashboardData } from 'services/dashboard-service'
import { isUserConnected } from 'services/AuthService'
import { createSocket } from 'services/SocketService'
import { SlugArrayToSymbolArray } from 'utils/crypto'
import dynamic from 'next/dynamic'
import PortfolioMenu from '@/components/menus/PortfolioMenu'
import PortfolioMenuD from '@/components/menus/PortfolioMenuD'
/*const PortfolioMenu = dynamic(() => import('@/components/menus/PortfolioMenu'), { ssr: false })*/
const SimpleWalletAssetDashboard = dynamic(() => import('@/components/SimpleWalletAssetDashboard'))
const SimpleCryptoDashboard = dynamic(() => import('@/components/SimpleCryptoDashboard'))

const BarChart = dynamic(() => import('@/components/charts/BarChart'), { ssr: false })
const PieChart = dynamic(() => import('@/components/charts/PieChart'), { ssr: false })
const DetailedChart = dynamic(() => import('@/components/charts/DetailedChart'), { ssr: false })

const CURRENCY = 'cad'

const Portfolio = () => {
	const router = useRouter()
	const [socket, setSocket] = useState()
	const [portfolioSocket, setPortfolioSocket] = useState()
	const [slug] = useState('Value')
	const [dateRange] = useState('1d')
	const [interval] = useState('1h')
	const [assets, setAssets] = useState()

	useEffect(async () => {
		if (!isUserConnected()) {
			router.push(`/login`)
			return
		}
		let userData = await getUserDashboardData()
		if (!userData.assets) return

		setAssets(userData.assets)
		let slugs = []
		userData.assets.map((asset) => {
			slugs.push(asset.name)
		})
		let symbols = SlugArrayToSymbolArray(slugs, CURRENCY, false)
		console.log(symbols)
		setSocket(createSocket(['general', `graph-${dateRange}-${interval}`], symbols, `wss://${window.location.host}`))
		setPortfolioSocket(
			createSocket([`dash-graph-${dateRange}-${interval}`], symbols, `wss://${window.location.host}`)
		)
	}, [])

	return !socket || !portfolioSocket || !assets || assets == undefined ? (
		<section className="section column principal first center">
			<section className="sub-section column">
				<PortfolioMenuD />
				<div className="detailed-chart detailed-div" />
				<div className="row space-between stretch">
					<div className="column pie-chart">
						<p className="detailed-div-title">Assets division (%)</p>
					</div>
					<div className="column bar-chart">
						<p className="detailed-div-title">Assets division ($)</p>
					</div>
				</div>
				<div className="simple-crypto-dashboard v-center" />
				<div className="simple-crypto-dashboard v-center" />
			</section>
		</section>
	) : (
		<section className="section column principal first center">
			<section className="sub-section column">
				<PortfolioMenu socket={socket} assets={assets} />
				<DetailedChart socket={portfolioSocket} slug={slug} wallet={true} />
				<div className="row space-between stretch">
					<PieChart socket={socket} assets={assets} />
					<BarChart socket={socket} assets={assets} />
				</div>
				<SimpleWalletAssetDashboard socket={socket} assets={assets} />
				<SimpleCryptoDashboard socket={socket} />
			</section>
		</section>
	)
}
// <PieChart socket={socket} assets={assets}/> import PieChart from '../../components/charts/PieChart'
Portfolio.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.portfolio.title'),
				description: t('pages.portfolio.description')
			}}
		>
			{page}
		</Layout>
	)
}

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'dashboard', 'crypto', 'detailedchart']))
		}
	}
}

export default Portfolio
