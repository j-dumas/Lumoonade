import BottomArrow from '@/components/BottomArrow'
import Layout from '@/layouts/Layout'
import React from 'react'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { deleteCookie, getCookie } from 'services/CookieService'

const Home = () => {
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
