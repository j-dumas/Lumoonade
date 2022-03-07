import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/layouts/Layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
//import PortfolioMenu from '../../components/menus/PortfolioMenu'
import PieChart from '../../components/charts/PieChart'
import DetailedChart from '../../components/charts/DetailedChart'

import { getUserDashboardData } from '../../../services/dashboard-service'
import { isUserConnected } from '../../../services/AuthService'
import { createSocket } from '../../../services/SocketService'
import SimpleWalletAssetDashboard from '../../components/SimpleWalletAssetDashboard'
import SimpleCryptoDashboard from '../../components/SimpleCryptoDashboard'
import { SlugArrayToSymbolArray } from '../../../utils/crypto'
import dynamic from 'next/dynamic'

const PortfolioMenu = dynamic(
	() => {
		return import('../../components/menus/PortfolioMenu')
	},
	{ ssr: false }
)

const CURRENCY = 'usd'

const Dashboard = () => {
	const router = useRouter()
	const [socket, setSocket] = useState()
	const [portfolioSocket, setPortfolioSocket] = useState()
	const [slug, setSlug] = useState('eth-cad')
	const [dateRange, setDateRange] = useState('1d')
	const [interval, setInterval] = useState('1h')
	const [assets, setAssets] = useState()

	useEffect(async () => {
		if (!isUserConnected()) {
			router.push(`/login`)
			return
		}
		let userData = await getUserDashboardData()
		console.log(userData.assets)
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
		<></>
	) : (
		<>
			<section className="section column principal first center">
				<section className="sub-section column">
					<PortfolioMenu socket={socket} assets={assets} />

					<div className="row space-between">
						<PieChart socket={socket} assets={assets} />
						<DetailedChart socket={portfolioSocket} slug={slug} wallet={true} />
					</div>
					<SimpleWalletAssetDashboard socket={socket} assets={assets} />
					<SimpleCryptoDashboard socket={socket} />
				</section>
			</section>
		</>
	)
}
// <PieChart socket={socket} assets={assets}/> import PieChart from '../../components/charts/PieChart'
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
