import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'

export default function EmailConfirmationCard() {
	const { t } = useTranslation('email')

	const router = useRouter()
	const { key } = router.query

	useEffect(() => {
		async function getConfirmation() {
			if (key !== undefined) {
				// Api call

				try {
					await fetch('/api/confirmation/verify/' + key, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					})
				} catch (e) {}
			}
		}

		getConfirmation()
	}, [key])

	return (
		<div className="form">
			<h1 className="form-title">{t('title')}</h1>
			<h3>{t('message')}</h3>
			<Link href="/login">
				<a className="link">{t('login')}</a>
			</Link>
		</div>
	)
}
