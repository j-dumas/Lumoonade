import LayoutNoNav from '@/layouts/Layout-no-nav'
import EmailConfirmationCard from '@/components/EmailConfirmationCard'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'

const Bubbles = dynamic(() => import('@/components/Bubbles'), { ssr: false })

const EmailConfirmation = () => {
	return (
		<>
			<main>
				<Bubbles />
				<EmailConfirmationCard />
				<div className="spacer layer1"></div>
			</main>
		</>
	)
}

EmailConfirmation.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<LayoutNoNav
			pageMeta={{
				title: t('pages.email.title'),
				description: t('pages.email.description')
			}}
		>
			{page}
		</LayoutNoNav>
	)
}

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'email']))
		}
	}
}

export default EmailConfirmation
