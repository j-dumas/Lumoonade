import React, { useState, useEffect } from 'react'
import Functions from '../services/CryptoService'
import ButtonFavorite from '../components/ButtonFavorite'
import SimplestItemView from './SimplestItemView'
import { useRouter } from 'next/router'

function CompareMenu(props) {
	const router = useRouter()
	const [searchList, setSearchList] = useState([])
	const [datas, setDatas] = useState([])

	useEffect(() => {
		props.socket.emit('update', props.socket.id, props.compareList)
	})

	useEffect(async () => {
		props.socket.on('data', (data) => {
			setDatas(data)
		})
		if (props.socket) return () => socket.disconnect()
	}, [])

	function changeURI() {
		let assets = ''
		if (props.compareList.length > 0) {
			props.compareList.map((asset, i) => {
				asset = asset.split('-')[0].toString()
				if (i == 0) assets = asset
				else assets += '-' + asset
			})
		}

		router.push(
			{
				pathname: `/compare`,
				query: {}
			},
			`/compare?assets=${assets}`,
			{ shallow: true }
		)
	}

	async function updateSearchList(event) {
		event.preventDefault()
		let search = event.target[0].value
		if (!search) search = '0'
		let list = await Functions.GetSCryptocurrencySlugsBySeach(search, 0, 8)
		list = list.assets
		setSearchList(list)
	}

	function addToCompareList(event) {
		event.preventDefault()

		if (props.compareList.length >= 5) return
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

	return (
		<>
			<div className="column detailed-informations detailed-div max-width">
				<div className="detailed-div-menu row space-between">
					<label className="detailed-div-title">Comparing</label>
					<div>
						<select name="" id="" className="detailed-chart-options-select">
							<option value="price">Price</option>
							<option value="efficiency">Efficiency</option>
							<option value="volume">Volume</option>
							<option value="marketCap">Market cap</option>
						</select>
						<p className="detailed-div-title">{'$ = ' + props.currency + '$'}</p>
					</div>
				</div>
				<div className="row space-between detailed-div-item">
					<p className="detailed-div-item-label">With</p>
					<form action="" onSubmit={updateSearchList}>
						<input type="search" />
						<button type="submit" value="Submit">
							Search
						</button>
					</form>
				</div>
				<form className="row detailed-div-item start">
					{searchList.map((element) => {
						return (
							<button
								onClick={addToCompareList}
								key={element.slug}
								value={element.slug}
								className="dynamic-list-item"
							>
								{element.slug}
							</button>
						)
					})}
				</form>
				{props.compareList.length > 0 ? (
					<div className="row">
						<div className="row">
							<p></p>
							<p className="detailed-div-title">Asset</p>
						</div>
						<p className="detailed-div-title">Price ($)</p>
						<div className="row">
							<p className="detailed-div-title">24h Change</p>
							<p className="detailed-div-title"></p>
						</div>
						<p></p>
					</div>
				) : (
					<p></p>
				)}
				<div className="column detailed-div-item">
					{props.compareList.map((element, i) => {
						let data = {}
						datas.map((crypto) => {
							if (crypto.fromCurrency.toString() + '-' + props.currency == element) {
								data = crypto
							}
						})
						return (
							<SimplestItemView
								command={removeFromCompareList}
								slug={element}
								data={data}
								key={element}
							/>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default CompareMenu
