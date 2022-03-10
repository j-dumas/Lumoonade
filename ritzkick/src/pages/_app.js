import { appWithTranslation } from 'next-i18next'

import Script from 'next/script'

import '@/styles/globals.css'
import '@/styles/Main.css'
import '@/styles/Navbar.css'
import '@/styles/Header.css'
import '@/styles/Footer.css'
import '@/styles/Container.css'
import '@/styles/Globe.css'
import '@/styles/BottomArrow.css'
import '@/styles/Icons.css'
import '@/styles/Particules.scss'
import '@/styles/LoginForm.css'
import '@/styles/BubbleEffect.css'
import '@/styles/Charts.css'
import '@/styles/SimpleCrypto.css'
import '@/styles/Profile.css'
import '@/styles/DetailedCrypto.css'
import '@/styles/Form.css'

/* eslint-disable sort-imports, import/first */
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

// TODO: Change for SVGR/Webpack: https://github.com/gregberge/svgr/tree/main/packages/webpack

function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || ((page) => page)

	let app
	if (process.env.NODE_ENV === 'production') {
		app = (
			<div>
				<Script
					id="gtag"
					strategy="lazyOnload"
					src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TOKEN}`}
				/>
				<Script id="gtag-script" strategy="lazyOnload">
					{`window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TOKEN}');`}
				</Script>
				<Component {...pageProps} />
			</div>
		)
	} else {
		app = <Component {...pageProps} />
	}

	return getLayout(app)
}

export default appWithTranslation(MyApp)
