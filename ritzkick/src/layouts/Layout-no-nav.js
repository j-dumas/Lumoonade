import dynamic from 'next/dynamic'

const DomHead = dynamic(() => import('@/components/DomHead'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function LayoutNoNav({ children, pageMeta }) {
	return (
		<>
			<DomHead pageMeta={pageMeta} />
			{children}
			<Footer />
		</>
	)
}
