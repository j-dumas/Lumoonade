import React from 'react'
import GoogleLogin from 'react-google-login'
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

	// function signOut() {
	// 	var auth2 = gapi.auth2.getAuthInstance()
	// 	auth2.signOut()
	// }

	return (
		<div id="googleSignin">
			<GoogleLogin
				clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
				buttonText="Login"
				onSuccess={onSignIn}
				cookiePolicy={'single_host_origin'}
				strategy="lazyOnload"
			/>
			<h4>{t('login.google')}</h4>
		</div>
	)
}
