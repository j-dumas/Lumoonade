import React, { useState, useEffect } from 'react'
import {getFavorites, addFavorite, deleteFavorite} from '../services/UserService'
import Icons from './Icons'
import {isUserConnected} from '../services/AuthService'
import {AreSlugsEqual} from '../utils/crypto'

function ButtonFavorite(props) {
	const [favorite, setFavorite] = useState(false)

	async function handleFavorite() {
		if (favorite) await deleteFavorite(props.slug);
		else await addFavorite(props.slug);
		updateFavorite()
	}

	async function isSlugInFavorites() {
		const favList = await getFavorites()
		let isInFav = false
		favList.map((element) => {
			if (AreSlugsEqual(element.slug, props.slug)) isInFav = true
		})
		return isInFav
	}

	async function updateFavorite() {
		let bool = await isSlugInFavorites()
		setFavorite(bool)
	}

	useEffect(async () => {
		updateFavorite()
	}, [])

	return (
		!isUserConnected() ? null :
		<>
			<div className="">
				<div onClick={async () => {await handleFavorite()}}>{favorite ? <Icons.StarFulled /> : <Icons.StarEmpty />}</div>
			</div>
		</>
	)
}

export default ButtonFavorite
