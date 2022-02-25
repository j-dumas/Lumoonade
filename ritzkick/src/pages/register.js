import DomHead from '../src/components/DomHead'
import Footer from '../src/components/Footer'
import RegisterForm from '../src/components/forms/RegisterForm'
import Bubbles from '../src/components/Bubbles'
import Layout from '../src/components/Layout'
import { useEffect } from 'react'
import { getCookie } from '../services/CookieService'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Register = () => {
	useEffect(() => {
		const token = getCookie('token')
		if (token !== undefined) {
			window.location.href = '/'
		}
	}, [])

	return (
		<>
			<main>
				<RegisterForm />
				<Bubbles />
				<div className="spacer layer1"></div>
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
