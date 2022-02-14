import React, { useState, useEffect } from 'react'
import DomHead from '../../components/DomHead'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DetailedCryptoView from '../../components/DetailedCryptoView'

export default function Asset({ assetData }) {
	console.log(assetData)
	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'Asset',
					description: 'Cryptool asset page',
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
	//const allAssetData = JSON.stringify(assetData)
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
         		id: 'eth'
       		}
     	},
		{
			params: {
			  id: 'btc'
			}
	  	}
   ]
}

export async function getAssetData(id) {
	return {
		slug:id
	}
}