import { useEffect } from 'react'
import { getCookie } from 'services/CookieService'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'

import Layout from '@/layouts/Layout'
import { useRouter } from 'next/router'

const RegisterForm = dynamic(() => import('@/components/forms/RegisterForm'))
const Bubbles = dynamic(() => import('@/components/Bubbles'))

const Register = () => {
	const router = useRouter()

	useEffect(() => {
		const token = getCookie('token')
		if (token !== undefined) {
			router.push('/')
		}
	}, [])

	return (
		<>
			<main>
				<RegisterForm />
				<Bubbles />
				<div className="spacer layer2"></div>
			</main>
		</>
	)
}

Register.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.register.title'),
				description: t('pages.register.description')
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

export default Register
