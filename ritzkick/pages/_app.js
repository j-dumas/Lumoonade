import '../styles/globals.css'
import '../styles/Main.css'
import '../styles/Navbar.css'
import '../styles/Header.css'
import '../styles/Footer.css'
import '../styles/Container.css'
import '../styles/Globe.css'
import '../styles/BottomArrow.css'
import '../styles/Cursor.css'
import '../styles/Icons.css'
import '../styles/Particules.scss'
import '../styles/LoginForm.css'
import '../styles/BubbleEffect.css'
import '../styles/Charts.css'
import '../styles/SimpleCrypto.css'

import Script from 'next/script'

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false /* eslint-disable import/first */

const prod = process.env.PROD || false
const gToken = process.env.GOOGLE_ANALYTICS_TOKEN || null

function MyApp({ Component, pageProps }) {
	let app
	if (prod == 'true') {
		app = (
			<>
				<Script strategy='lazyOnload' src={`https://www.googletagmanager.com/gtag/js?id=${gToken}`} />
				<Script strategy='lazyOnload'>
					{
						`window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', '${gToken}');`
					}
				</Script>
				<Component {...pageProps} />
			</>
		)
	} else {
		app = (
			<Component {...pageProps} />
		)
	}

	return app
}

export default MyApp
