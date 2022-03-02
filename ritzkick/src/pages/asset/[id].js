import React, { useState, useEffect } from 'react'
import DomHead from '@/components/DomHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DetailedCryptoView from '@/components/views/DetailedCryptoView'
import Layout from '@/components/Layout'
import Functions from 'services/CryptoService'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const Asset = ({ assetData }) => {
	return (
		<>
			<section className="section column principal first center">
				<DetailedCryptoView slug={assetData.slug} currency="CAD" />
			</section>
		</>
	)
}

Asset.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')
	const router = useRouter()
	const { id } = router.query

	return (
		<Layout
			pageMeta={{
				title: `${t('pages.asset.title')} ${id.toUpperCase()}`,
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
		fallback: false
	}
}

export async function getStaticProps({ params, locale }) {
	const assetData = await getAssetData(params.id)
	return {
		props: {
			assetData,
			...(await serverSideTranslations(locale, ['common', 'crypto']))
		}
	}
}

export async function getAllAssetIds() {
	let slugs = await Functions.GetAllAvailableSlug()

	let ids = []
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
