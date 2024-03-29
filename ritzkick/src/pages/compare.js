import Layout from '@/layouts/Layout'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'

const CompareView = dynamic(() => import('@/components/views/CompareView'))

const CURRENCY = 'cad'

const Compare = () => {
	return (
		<>
			<section className="section column principal first center">
				<CompareView currency={CURRENCY} />
			</section>
		</>
	)
}

Compare.getLayout = function getLayout(page) {
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
			...(await serverSideTranslations(locale, ['common', 'compare', 'crypto', 'detailedchart']))
		}
	}
}

export default Compare
