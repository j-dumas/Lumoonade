import React, { useState, useEffect } from 'react'
import SimpleCryptoCardDashboard from '@/components/SimpleCryptoCardDashboard'
import Functions from 'services/CryptoService'
import { getFavorites } from 'services/UserService'
import { isUserConnected } from 'services/AuthService'
import { SlugArrayToSymbolArray } from 'utils/crypto'
import { createSocket } from 'services/SocketService'
import Layout from '@/layouts/Layout'
import Icons from '../components/Icons'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const CURRENCY = 'usd'

const Assets = () => {
	const { t } = useTranslation('assets')

	const [keyword, setKeyword] = useState()
	const [searchList, setSearchList] = useState([])
	const [socket, setSocket] = useState()
	const [favSocket, setFavSocket] = useState()
	const [pagination, setPagination] = useState([1, 1]) // Page#, #Pages
	const decrementPage = async () => {
		const currentP = pagination[0]
		if (currentP > 1) {
			setPagination(currentP - 1, pagination[1])
			await searchAsset(keyword, currentP - 1)
		}
	}
	const incrementPage = async () => {
		const currentP = pagination[0]
		if (currentP < pagination[1]) {
			setPagination(currentP + 1, pagination[1])
			await searchAsset(keyword, currentP + 1)
		}
	}

	async function prepareFavSocket() {
		console.log('CALL')
		if (isUserConnected()) {
			let symbols = SlugArrayToSymbolArray(await getFavorites(), CURRENCY, false)
			setFavSocket(createSocket(['general', `graph-1d-30m`], symbols, `wss://${window.location.host}`))
		}
	}

	useEffect(async () => {
		await prepareFavSocket()
		//let symbols = await Functions.GetTopGainersCryptocurrencies(8)
		//let list = SlugArrayToSymbolArray(symbols.assets, CURRENCY)
		let list = ['btc-usd', 'eth-usd', 'bnb-usd', 'ltc-usd', 'ada-usd', 'doge-usd', 'shib-usd', 'theta-usd']
		setSocket(createSocket(['general', `graph-1d-30m`], list, `wss://${window.location.host}`))
	}, [setSocket])

	useEffect(() => {
		if (socket) socket.emit('update', socket.id, searchList)
	}, [socket, searchList])

	async function updateSearchList(event) {
		event.preventDefault()

		const search = event.target[0].value
		setKeyword(search)
		if (!search || search == undefined || search == '') return
		await searchAsset(search, 1)
	}

	async function searchAsset(keyword, page) {
		let list = await Functions.GetSCryptocurrencySlugsBySeach(keyword, page, 12)
		setPagination([page, list.max_page])
		let symbols = []
		list.assets.map((element) => symbols.push(element.symbol + '-' + CURRENCY))
		setSearchList(symbols)
	}

	return (
		<section className="section column h-center principal first">
			<section className="sub-section">
				<div className="page-menu space-between row h-center">
					<div className="row h-center detailed-menu-info">
						<h1 className="detailed-menu-title">{t('markets')}</h1>
					</div>
					<form className="row" action="" onSubmit={updateSearchList}>
						<input type="search" />
						<button type="submit" value="Submit">
							<Icons.Search />
						</button>
					</form>
				</div>
			</section>

			<section className="sub-section column">
				{socket ? (
					<>
						{favSocket && searchList.length == 0 ? (
							<>
								<div className="row start">
									<Icons.StarFulled />
									<h1>{t('favorites')}</h1>
								</div>
								{ favSocket.auth.query.length == 0 ? <></> :
								<SimpleCryptoCardDashboard refresh={prepareFavSocket} socket={favSocket} small={true} />}
							</>
						) : null}
						<div className="row start">
							<Icons.List />
							<h1>{t('assets')}</h1>
						</div>
						<SimpleCryptoCardDashboard socket={socket}/>
						{searchList.length > 0 && pagination[1] > 1 ?
						<div className='row center'>
							<button onClick={decrementPage}>{'<'}</button><p>{pagination[0]} / {pagination[1]}</p><button  onClick={incrementPage}>{'>'}</button>
						</div>
						:<></>}
					</>
				) : null}
			</section>
		</section>
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
