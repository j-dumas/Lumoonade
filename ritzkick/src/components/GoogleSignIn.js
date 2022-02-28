import Script from 'next/script'
import React, { useEffect } from 'react'
import Head from 'next/head'
import GoogleLogin, { GoogleLogout } from 'react-google-login'
import { useTranslation } from 'next-i18next'

export default function GoogleSignIn() {
	const { t } = useTranslation('forms')

	function onSignIn(googleUser) {
		var profile = googleUser.getBasicProfile()
		console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName())
		console.log('Image URL: ' + profile.getImageUrl())
		console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
		var id_token = googleUser.getAuthResponse().id_token
		console.log('Id_token: ' + id_token)

		// var xhr = new XMLHttpRequest();
		// xhr.open('POST', 'https://yourbackend.example.com/tokensignin');
		// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		// xhr.onload = function() {
		//   console.log('Signed in as: ' + xhr.responseText);
		// };
		// xhr.send('idtoken=' + id_token);
	}

	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance()
		auth2.signOut().then(function () {
			console.log('User signed out.')
		})
	}

	return (
		<div id="googleSignin">
			<GoogleLogin
				clientId="878368249999-m504lbn87tdvn4cd9lrmg2vkh54iu8bi.apps.googleusercontent.com"
				buttonText="Login"
				onSuccess={onSignIn}
			/>
			{/* <a href="#" onClick={signOut}>Sign out</a> */}
			<h4>{t('login.google')}</h4>
		</div>
	)
}
