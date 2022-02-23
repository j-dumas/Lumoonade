import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'

const WEBSITE_NAME = 'Cryptool'

function DomHead({ pageMeta }) {
	const { t } = useTranslation('common')

	const meta = {
		title: t('meta.title'),
		description: t('meta.description'),
		type: t('meta.type'),
		...pageMeta
	}

	const [url, setUrl] = useState()

	useEffect(() => {
		const bubbletext = document.getElementsByClassName('bubbles')
		Array.prototype.forEach.call(bubbletext, function (element) {
			var bubblecount = (element.offsetWidth / 50) * 1.25
			for (var i = 0; i <= bubblecount; i++) {
				var size = (Math.floor(Math.random() * 80) + 40) / 3

				let span = document.createElement('span')
				span.classList.add('particle')
				span.style.top = '0px'
				span.style.left = '0px'
				if (Math.round(Math.random() * 1) == 1) span.style.backgroundColor = 'var(--yellow)'
				else span.style.backgroundColor = 'var(--main-color)'
				span.style.width = size.toString() + 'px'
				span.style.height = size.toString() + 'px'
				span.style.animationDelay = ((Math.floor(Math.random() * 30) + 0) / 10).toString() + 's'

				element.append(span)
			}
		})

		setUrl(window.location.href)
	}, [])

	return (
		<>
			<Head>
				<title>{meta.title}</title>
				<meta name="description" content={meta.description} />
				<link rel="icon" href="/favicon.ico" />
				{/* Open Graph */}
				<meta property="og:url" content={url} />
				<meta property="og:type" content={meta.type} />
				<meta property="og:site_name" content={WEBSITE_NAME} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:title" content={meta.title} />
			</Head>
		</>
	)
}

export default DomHead
