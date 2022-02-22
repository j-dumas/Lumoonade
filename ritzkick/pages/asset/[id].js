import React, { useState, useEffect } from 'react'
import DomHead from '../../components/DomHead'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DetailedCryptoView from '../../components/views/DetailedCryptoView'

export default function Asset({ assetData }) {
	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'Asset',
					description: 'Cryptool asset page'
				}}
			/>
			<Header />

			<section className="section column principal first center">
				<DetailedCryptoView slug={assetData.slug} currency="CAD" />
			</section>

			<Footer />
		</div>
	)
}

export async function getStaticPaths() {
	const paths = await getAllAssetIds()
	return {
		paths,
		fallback: false
	}
}

export async function getStaticProps({ params }) {
	const assetData = await getAssetData(params.id)
	return {
		props: {
			assetData
		}
	}
}

export async function getAllAssetIds() {
	return [
		{
			params: {
				id: 'ada'
			}
		},
		{
			params: {
				id: 'bnb'
			}
		},
		{
			params: {
				id: 'btc'
			}
		},
		{
			params: {
				id: 'doge'
			}
		},
		{
			params: {
				id: 'eth'
			}
		}
	]
}

export async function getAssetData(id) {
	return {
		slug: id //d.toString().toUpperCase()
	}
}
