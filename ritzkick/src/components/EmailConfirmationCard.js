import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { confirmEmail } from 'services/AuthService'

import { useTranslation } from 'next-i18next'

export default function EmailConfirmationCard() {
	const { t } = useTranslation('email')

	const router = useRouter()
	const { key } = router.query

	useEffect(async () => {
		if (key !== undefined) {
			await confirmEmail(key)
		}

		setTimeout(() => {
			router.push('/login')
		}, 4000)
	}, [key])

	return (
		<div className="form">
			<h1 className="form-title">{t('title')}</h1>
			<h3>{t('message')}</h3>
			<h3>Vous allez être redirigé sous peu</h3>
		</div>
	)
}
