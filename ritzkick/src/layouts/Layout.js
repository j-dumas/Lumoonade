import dynamic from 'next/dynamic'

const DomHead = dynamic(() => import('@/components/DomHead'))
const Header = dynamic(() => import('@/components/Header'))
const Footer = dynamic(() => import('@/components/Footer'))

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
