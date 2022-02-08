import dynamic from 'next/dynamic'

const Head = dynamic(() => import('./DomHead'))
const Header = dynamic(() => import('./Header'))
const Footer = dynamic(() => import('./Footer'))

export default function Layout({ children, pageMeta }) {
	return (
		<>
			<Head pageMeta={pageMeta} />
			<Header />
			{children}
			<Footer />
		</>
	)
}
