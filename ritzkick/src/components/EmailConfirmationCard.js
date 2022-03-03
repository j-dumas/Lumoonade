import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function EmailConfirmationCard() {
	const router = useRouter()
	const { key } = router.query

	useEffect(() => {
		async function getConfirmation() {
			if (key !== undefined) {
				try {
					const response = await fetch('/api/confirmation/verify/' + key, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					})

					if(response.status === 200){
						setInterval(() =>{
							window.location.assign("/login")
						}, 4000)
					}
				} catch (e) {}
			}
		}

		getConfirmation()
	}, [key])

	return (
		<div className="form">
			<h1 className="form-title">Confirmation de courriel</h1>
			<h3>Votre courriel est maintenant confirmé!</h3>
			<h3>Vous allez être redirigé sous peu</h3>
		</div>
	)
}
