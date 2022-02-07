import Head from 'next/head'
import React, { useEffect } from 'react'

const WEBSITE_TITLE = 'CRYPTOOL'
const WEBSITE_DESCRIPTION = 'CRYPTOOL'

function DomHead() {
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
				else span.style.backgroundColor = 'var(--orange)'
				span.style.width = size.toString() + 'px'
				span.style.height = size.toString() + 'px'
				span.style.animationDelay =
					((Math.floor(Math.random() * 30) + 0) / 10).toString() + 's'

				element.append(span)
			}
		})

		/****************************************************************/

		const hoverItem = document.getElementsByClassName('hover-item')
		// const cursor = document.querySelector('.cursor')

		// Array.prototype.forEach.call(hoverItem, function (element) {
		// 	console.log(cursor)
		// 	element.addEventListener('mouseenter', () => {
		// 		cursor.classList.add('cursor-hover')
		// 	})
		// 	element.addEventListener('mouseleave', () => {
		// 		cursor.classList.remove('cursor-hover')
		// 	})
		// })

		// document.addEventListener('mousemove', (e) => {
		// 	cursor.setAttribute(
		// 		'style',
		// 		'top: ' + (e.pageY - 10) + 'px; left: ' + (e.pageX - 10) + 'px;'
		// 	)
		// })

		// document.addEventListener('click', () => {
		// 	cursor.classList.remove('cursor-hover')
		// 	cursor.classList.add('expand')

		// 	var timeout = setTimeout(() => {
		// 		cursor.classList.remove('expand')
		// 	}, 500)
		// })

		//return () => clearTimeout(timeout)
	}, [])

	return (
		<>
			<Head>
				<title>{WEBSITE_TITLE}</title>
				<meta name='description' content={WEBSITE_DESCRIPTION} />
				<link rel='icon' href='/favicon.ico' />
			</Head>
		</>
	)
}

export default DomHead
