import React from 'react'
import GoogleLogin from 'react-google-login'
import { useTranslation } from 'next-i18next'
import { googleLogin } from 'services/AuthService'
import { useRouter } from 'next/router'

export default function GoogleSignIn() {
	const { t } = useTranslation('forms')
	const router = useRouter()

	async function onSignIn(googleUser) {
		const id_token = googleUser.getAuthResponse().id_token
		if (id_token !== undefined) {
			await googleLogin(id_token).then((res) => {
				if (res === 200) {
					router.push('/profile')
				}
			})
		}
	}

	return (
		<div id="googleSignin">
			<GoogleLogin
				clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
				buttonText={t('login.google')}
				onSuccess={onSignIn}
				cookiePolicy={'single_host_origin'}
				strategy="lazyOnload"
			/>
		</div>
	)
}
