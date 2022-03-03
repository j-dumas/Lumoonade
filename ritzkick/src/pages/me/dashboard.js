import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../layouts/Layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import PieChart from '../../components/charts/PieChart'
import { getUserDashboardData } from '../../../services/dashboard-service'
import { isUserConnected } from '../../../services/AuthService'
import DetailedChart from '../../components/charts/DetailedChart'
import { createSocket } from '../../../services/SocketService'
import SimpleCryptoDashboard from '../../components/SimpleCryptoDashboard'
import { SlugArrayToSymbolArray } from '../../../utils/crypto'

const CURRENCY = 'usd'

const Dashboard = () => {
	const router = useRouter()
	const [socket, setSocket] = useState()
	const [slug, setSlug] = useState('btc-cad')
	const [dateRange, setDateRange] = useState('1d')
	const [interval, setInterval] = useState('1h')
	useEffect(async () => {
		let userData = await getUserDashboardData()
		let slugs = []
		userData.assets.map((asset) => {
			slugs.push(asset.name)
		})
		let symbols = SlugArrayToSymbolArray(slugs, CURRENCY, false)
		setSocket(
			createSocket(['general', `graph-${dateRange}-${interval}`], symbols, `wss://${window.location.host}/`)
		)
	}, [])

	return !socket ? (
		<></>
	) : (
		<>
			<section className="section column principal first center">
				<section className="sub-section">
					<div className="page-menu space-between row h-center">
						<div className="row h-center detailed-menu-info">
							<h1 className="detailed-menu-title">Portfolio</h1>
						</div>
					</div>
					<div className="row">
						<PieChart socket={socket} />
						<DetailedChart socket={socket} slug={slug} />
					</div>
					<SimpleCryptoDashboard socket={socket} />
				</section>
			</section>
		</>
	)
}
//
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
