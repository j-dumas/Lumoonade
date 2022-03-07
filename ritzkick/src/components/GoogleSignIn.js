import Script from 'next/script'
import React, { useEffect } from 'react'
import Head from 'next/head'
import GoogleLogin, { GoogleLogout } from 'react-google-login'
import { useTranslation } from 'next-i18next'
import { googleLogin } from 'services/AuthService'

export default function GoogleSignIn() {
	const { t } = useTranslation('forms')

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

	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance()
		auth2.signOut()
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
