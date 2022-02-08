import dynamic from 'next/dynamic'

const DomHead = dynamic(() => import('./DomHead'))
const Header = dynamic(() => import('./Header'))
const Footer = dynamic(() => import('./Footer'))

export default function Layout({ children, pageMeta }) {
	return (
		<>
			<DomHead pageMeta={pageMeta} />
			<Header />
			{children}
			<Footer />
		</>
	)
}
