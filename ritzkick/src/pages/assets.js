import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import { createSocket } from 'services/SocketService'
import Functions from 'services/CryptoService'
import { getFavorites } from 'services/UserService'
import { isUserConnected } from 'services/AuthService'
import Layout from '@/layouts/Layout'
import { SlugArrayToSymbolArray } from 'utils/crypto'

/* eslint-disable sort-imports */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const SimpleCryptoCardDashboard = dynamic(() => import('@/components/SimpleCryptoCardDashboard'))

const CURRENCY = 'usd'

const Assets = () => {
	const { t } = useTranslation('assets')

	const [searchList, setSearchList] = useState([])

	const [socket, setSocket] = useState()
	const [favSocket, setFavSocket] = useState()

	useEffect(() => {
		async function prepareSockets() {
			if (isUserConnected()) {
				let symbols = SlugArrayToSymbolArray(await getFavorites(), CURRENCY, false)
				setFavSocket(createSocket(['general', `graph-1d-30m`], symbols, `wss://${window.location.host}`))
			}
		}

		prepareSockets()

		// let symbols = await Functions.GetTopGainersCryptocurrencies(8)
		// let list = SlugArrayToSymbolArray(symbols.assets, CURRENCY)
		let list = ['btc-usd', 'eth-usd', 'bnb-usd', 'ltc-usd', 'ada-usd', 'doge-usd', 'shib-usd', 'theta-usd']
		setSocket(createSocket(['general', `graph-1d-30m`], list, `wss://${window.location.host}`))
	}, [setSocket])

	useEffect(() => {
		if (socket) socket.emit('update', socket.id, searchList)
	}, [socket, searchList])

	async function updateSearchList(event) {
		event.preventDefault()
		const search = event.target[0].value
		if (!search || search == undefined || search == '') return

		let symbols = []
		let list = await Functions.GetSCryptocurrencySlugsBySeach(search, 0, 8)
		list.assets.map((element) => symbols.push(element.symbol + '-' + CURRENCY))
		setSearchList(symbols)
	}

	return (
		<>
			<section className="section column center principal first">
				<section className="sub-section">
					<div className="page-menu space-between row h-center">
						<div className="row h-center detailed-menu-info">
							<h1 className="detailed-menu-title">{t('markets')}</h1>
						</div>
						<form action="" onSubmit={updateSearchList}>
							<input type="search" />
							<button type="submit" value="Submit">
								{t('search')}
							</button>
						</form>
						<div className="detailed-menu-actions row h-center"></div>
					</div>
				</section>

				<section className="sub-section">
					{socket ? (
						<>
							{favSocket ? (
								<>
									<h1>{t('favorites')}</h1>
									<SimpleCryptoCardDashboard socket={favSocket} />
								</>
							) : null}
							<h1>{t('assets')}</h1>
							<SimpleCryptoCardDashboard socket={socket} />
						</>
					) : null}
				</section>
			</section>
		</>
	)
}

Assets.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.assets.title'),
				description: t('pages.assets.description')
			}}
		>
			{page}
		</Layout>
	)
}

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'assets', 'crypto']))
		}
	}
}

export default Assets
