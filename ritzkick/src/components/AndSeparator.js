import React from 'react'
import { useTranslation } from 'next-i18next'

const AndSeparator = () => {
	const { t } = useTranslation('forms')

	return (
		<div className="OU">
			<hr className="line"></hr>
			<p id="and">{t('or')}</p>
			<hr className="line"></hr>
		</div>
	)
}

export default AndSeparator
