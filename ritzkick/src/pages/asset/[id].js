import dynamic from 'next/dynamic'
import Functions from 'services/CryptoService'
import Layout from '@/layouts/Layout'
import React from 'react'
import { useRouter } from 'next/router'

/* eslint-disable sort-imports */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const DetailedCryptoView = dynamic(() => import('@/components/views/DetailedCryptoView'), {
	ssr: true,
	loading: () => <div>Loading...</div>
})

const CURRENCY = 'cad'

const Asset = ({ assetData }) => {
	const router = useRouter()

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	return (
		<>
			<section className="section column principal first h-center">
				<DetailedCryptoView slug={assetData.slug} currency={CURRENCY} />
			</section>
		</>
	)
}

Asset.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')
	const router = useRouter()
	const id = router.query['id']

	return (
		<Layout
			pageMeta={{
				title: `${t('pages.asset.title')} ${id ? id.toUpperCase() : ''}`,
				description: t('pages.asset.description')
			}}
		>
			{page}
		</Layout>
	)
}

export async function getStaticPaths() {
	const paths = await getAllAssetIds()
	return {
		paths,
		fallback: true
	}
}

export async function getStaticProps({ params, locale }) {
	const assetData = await getAssetData(params.id)
	return {
		props: {
			assetData,
			...(await serverSideTranslations(locale, ['common', 'crypto', 'detailedchart', 'detailedmenu', 'alert']))
		}
	}
}

export async function getAllAssetIds() {
	let slugs = await Functions.GetAllAvailableSlug()

	let ids = []
	if (!slugs) return ids
	slugs.map((slug) => {
		ids.push({
			params: {
				id: slug
			}
		})
	})

	return ids
}

export async function getAssetData(id) {
	return {
		slug: id
	}
}

export default Asset
