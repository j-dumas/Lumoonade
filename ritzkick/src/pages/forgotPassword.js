import dynamic from 'next/dynamic'

import Layout from '@/layouts/Layout'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const ForgotPasswordForm = dynamic(() => import('@/components/forms/ForgotPasswordForm'))
const Bubbles = dynamic(() => import('@/components/Bubbles'), { ssr: false })

const ForgotPassword = () => {
	return (
		<section className="column center principal first layer3">
			<Bubbles />
			<ForgotPasswordForm />
		</section>
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
