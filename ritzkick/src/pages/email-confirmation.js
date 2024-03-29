import dynamic from 'next/dynamic'
import EmailConfirmationCard from '@/components/EmailConfirmationCard'
import LayoutNoNav from '@/layouts/Layout-no-nav'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Bubbles = dynamic(() => import('@/components/Bubbles'))

const EmailConfirmation = () => {
	return (
		<section className="column center principal first layer1">
			<Bubbles />
			<EmailConfirmationCard />
		</section>
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
