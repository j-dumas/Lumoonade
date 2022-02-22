import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import LoginForm from '../components/forms/LoginForm'
import Bubbles from '../components/Bubbles'
import Layout from '../components/Layout'
import { useEffect } from 'react'
import { getCookie } from '../services/CookieService'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Login = () => {
	useEffect(() => {
		const token = getCookie('token')
		if (token !== undefined) {
			window.location.href = '/'
		}
	}, [])

	return (
		<>
			<main>
				<LoginForm />
				<Bubbles />
				<div className="spacer layer1"></div>
			</main>
		</>
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
