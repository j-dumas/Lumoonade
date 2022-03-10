import dynamic from 'next/dynamic'
import { getCookie } from 'services/CookieService'
import Layout from '@/layouts/Layout'
import { useEffect } from 'react'

/* eslint-disable sort-imports */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const LoginForm = dynamic(() => import('@/components/forms/LoginForm'))
const Bubbles = dynamic(() => import('@/components/Bubbles'), { ssr: false })

const Login = () => {
	const router = useRouter()

	useEffect(() => {
		const token = getCookie('token')
		if (token !== undefined) {
			router.push('/')
		}
	}, [])

	return (
		<section className="column center principal first layer1">
			<LoginForm />
			<Bubbles />
		</section>
	)
}

Login.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.login.title'),
				description: t('pages.login.description')
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

export default Login
