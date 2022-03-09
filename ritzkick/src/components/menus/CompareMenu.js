import React, { useState, useEffect } from 'react'
import Functions from 'services/CryptoService'
import ButtonFavorite from '@/components/ButtonFavorite'
import SimplestItemView from '@/components/views/SimplestItemView'
import { useRouter } from 'next/router'
import Icons from '../../components/Icons'

import { useTranslation } from 'next-i18next'

const MAX_COMPARE = 4

function CompareMenu(props) {
	const { t } = useTranslation('compare')
	const router = useRouter()
	const [searchList, setSearchList] = useState([])
	const [datas, setDatas] = useState([])

	useEffect(() => {
		props.socket.emit('update', props.socket.id, props.compareList)
	}, [searchList])

	useEffect(() => {
		props.socket.on('data', (data) => {
			setDatas(data)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	function changeURI() {
		let assets = ''
		if (props.compareList.length > 0) {
			props.compareList.map((asset, i) => {
				asset = asset.split('-')[0].toString()
				if (i == 0) assets = asset
				else assets += '-' + asset
			})

			router.push(
				{
					pathname: `/compare`,
					query: {}
				},
				`/compare?assets=${assets}`,
				{ shallow: true }
			)
		}
	}

	async function updateSearchList(event) {
		event.preventDefault()
		let search = event.target[0].value
		if (!search) search = '0'
		let list = await Functions.GetSCryptocurrencySlugsBySeach(search, 1, 8)

		setSearchList(list.assets)
	}

	function addToCompareList(event) {
		event.preventDefault()

		if (props.compareList.length >= MAX_COMPARE) return
		const elementToAdd = (event.target.value + '-' + props.currency).toUpperCase()

		let isDoubled = false
		props.compareList.map((element) => {
			if (element === elementToAdd) {
				isDoubled = true
				return
			}
		})
		if (isDoubled) return

		const lastCompareList = props.compareList
		lastCompareList.push(elementToAdd)
		props.setCompareList(lastCompareList)
		setSearchList([])

		changeURI()
	}

	function removeFromCompareList(element) {
		const lastCompareList = props.compareList
		lastCompareList.splice(lastCompareList.indexOf(element), 1)
		props.setCompareList(lastCompareList)
		setSearchList([])

		changeURI()
	}

	return !searchList ? (
		<></>
	) : (
		<div className="column detailed-informations detailed-div w-45">
			<div className="detailed-div-menu row space-between">
				<label className="detailed-div-title" for="with">{t('menu.comparing')}</label>
				<div>
					<select name="with" id="" className="detailed-chart-options-select">
						<option value="price">{t('menu.options.price')}</option>
						{/*
						TODO: Lorsque l'on aura implémenter les autres données.
						<option value="efficiency">{t('menu.options.efficiency')}</option>
						<option value="volume">{t('menu.options.volume')}</option>
						<option value="marketCap">{t('menu.options.market-cap')}</option>
						*/}
					</select>
					<p className="detailed-div-title">{'$ = ' + props.currency + '$'}</p>
				</div>
				
				<form className="row" action="" onSubmit={updateSearchList}>
					<label for='search' className="detailed-div-title">{t('menu.with')}</label>
					<input className='mini-search' name='search' type="search" />
					<button className='mini-search-button' type="submit" value="Submit"><Icons.Search /></button>
				</form>
			</div>
			<div className="row detailed-div-menu start gap-5">
				{searchList.map((element) => {
					return (
						<button
							onClick={addToCompareList}
							key={element.symbol}
							value={element.symbol}
							className="dynamic-list-item"
						>
							{element.symbol}
						</button>
					)
				})}
			</div>
			<br />
			<div className="row detailed-div-menu">
				{props.compareList.map((element, i) => {
					let data = {}
					datas.map((crypto) => {
						if (crypto.fromCurrency.toString() + '-' + props.currency == element) {
							data = crypto
						}
					})
					return <SimplestItemView command={removeFromCompareList} slug={element} data={data} key={element} />
				})}
			</div>
		</div>
	)
}

export default CompareMenu
