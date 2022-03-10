import DomHead from '@/components/DomHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomArrow from '@/components/BottomArrow'
import SimpleCryptoDashboard from '@/components/SimpleCryptoDashboard'
import React, { useState, useEffect } from 'react'
import Layout from '@/layouts/Layout'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { deleteCookie, getCookie } from 'services/CookieService'

const Home = () => {
	const [data, setData] = useState([{}])
	const { t } = useTranslation('index')
	const router = useRouter()
	const { logout } = router.query

	useEffect(() => {
		if (logout) {
			console.log('called')
			deleteCookie('token')
			console.log(getCookie('token'))
		}
	}, [])

	/*
	<div className="column center">
	<h1 className="website-title item">{t('title')}</h1>
	<h2 className="subtitle item">{t('description')}</h2>
	</div>
	<text className='subtitle item' x="40%" y="60%"  textAnchor="middle">{t('description')}</text>
	*/

	return (
		<>
			<section className="column first principal center">
				<div className="column center w-100 gap-0">
					
					<svg width="100%" height="100px">
						<text className='website-title anim' x="52%" y="80%"  textAnchor="middle">{t('title')}</text>
					</svg>
					<svg width="100%" height="50px">
						<text className='subtitle item' x="50%" y="75%"  textAnchor="middle">{t('description')}</text>
					</svg>
					
				</div>
				<BottomArrow />
			</section>

			<svg className="svg svg-transit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
				<path
					fill="#0099ff"
					fillOpacity="1"
					d="M0,128L205.7,192L411.4,128L617.1,192L822.9,32L1028.6,64L1234.3,192L1440,96L1440,320L1234.3,320L1028.6,320L822.9,320L617.1,320L411.4,320L205.7,320L0,320Z"
				></path>
			</svg>
			<section className="section row second"></section>
		</>
	)
}

Home.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.index.title'),
				description: t('pages.index.description')
			}}
		>
			{page}
		</Layout>
	)
}

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'index']))
		}
	}
}

export default Home
