import React from 'react'
import { useTranslation } from 'next-i18next'

const DEV_TEAM_NAME = 'RitzKick'

function Footer() {
	const { t } = useTranslation('common')

	return (
		<>
			<footer>
				<a href="https://konjuu.com" target="_blank" rel="noreferrer">
					{t('footer.powered') + DEV_TEAM_NAME}
				</a>
			</footer>
		</>
	)
}

export default Footer
