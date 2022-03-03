import Bubbles from '@/components/Bubbles'
import Layout from '@/layouts/Layout'
import ResetPasswordForm from '@/components/forms/ResetPasswordForm'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const ResetPassword = () => {
	return (
		<>
			<main>
				<Bubbles />
				<ResetPasswordForm />
				<div className="spacer layer1"></div>
			</main>
		</>
	)
}

ResetPassword.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.reset.title'),
				description: t('pages.reset.description')
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

export default ResetPassword
