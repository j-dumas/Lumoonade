import Bubbles from '@/components/Bubbles'
import LayoutNoNav from '@/layouts/Layout-no-nav'
import ResetPasswordForm from '@/components/forms/ResetPasswordForm'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const ResetPassword = () => {
	return (
		<section className='column center principal first layer1'>
				<Bubbles />
				<ResetPasswordForm />
		</section>
	)
}

ResetPassword.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<LayoutNoNav
			pageMeta={{
				title: t('pages.reset.title'),
				description: t('pages.reset.description')
			}}
		>
			{page}
		</LayoutNoNav>
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
