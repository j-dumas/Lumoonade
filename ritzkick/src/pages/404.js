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

const NotFound = () => {
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

	return (
		<>
			<section className="column first principal center">
				<div className="column center">
					<div className="column center">
						<h1 className="website-title item">{t('title')}</h1>
						<h2 className="subtitle item">{t('description')}</h2>
					</div>
				</div>
				<BottomArrow />
			</section>
		</>
	)
}

NotFound.getLayout = function getLayout(page) {
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

export default NotFound
