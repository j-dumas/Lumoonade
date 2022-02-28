import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'

import Layout from '@/components/Layout'

const ForgotPasswordForm = dynamic(() => import('@/components/forms/ForgotPasswordForm'))
const Bubbles = dynamic(() => import('@/components/Bubbles'))

const ForgotPassword = () => {
	return (
		<>
			<main>
				<Bubbles />
				<ForgotPasswordForm />
				<div className="spacer layer1"></div>
			</main>
		</>
	)
}

ForgotPassword.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.forgot.title'),
				description: t('pages.forgot.description')
			}}
		>
			{page}
		</Layout>
	)
}

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'forms']))
		}
	}
}

export default ForgotPassword
