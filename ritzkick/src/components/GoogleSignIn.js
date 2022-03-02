import Script from 'next/script'
import React, { useEffect } from 'react'
import Head from 'next/head'
import GoogleLogin, { GoogleLogout } from 'react-google-login'
import { useTranslation } from 'next-i18next'

export default function GoogleSignIn() {
	const { t } = useTranslation('forms')

	function onSignIn(googleUser) {
		console.log('Test')
		var profile = googleUser.getBasicProfile()
		console.log('ID: ' + profile.getId())
		console.log('Name: ' + profile.getName())
		console.log('Image URL: ' + profile.getImageUrl())
		console.log('Email: ' + profile.getEmail())
	}

	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance()
		auth2.signOut()
	}

	const responseGoogle = (response) => {
		console.log(response)
	}

	return (
		<div id="googleSignin">
			<GoogleLogin
				clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
				buttonText="Login"
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				cookiePolicy={'single_host_origin'}
				strategy="lazyOnload"
			/>
			{/* <a href="#" onClick={signOut}>Sign out</a> */}
			<h4>{t('login.google')}</h4>
		</div>
	)
}
