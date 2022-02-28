import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import PieChart from '../../../components/charts/PieChart'
import { getUserDashboardData } from '../../../services/dashboard-service'
import { isUserConnected } from '../../../services/AuthService'

const Dashboard = () => {
	const router = useRouter()
    const [data, setData] = useState()

    useEffect(async () => {
		//if (!isUserConnected()) router.push('/login')

        let data = await getUserDashboardData()
		console.log(data)
        if (!data && data != undefined) setData(data.assets)
    }, [])

	return (
		<>
			<section className="section column principal first center">
                <PieChart data={data}/>
			</section>
		</>
	)
}

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