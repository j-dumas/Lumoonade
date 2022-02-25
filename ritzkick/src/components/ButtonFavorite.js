import React, { useState, useEffect } from 'react'
import { getFavorites, addFavorite, deleteFavorite } from 'services/UserService'
import Icons from '@/components/Icons'
import { isUserConnected } from 'services/AuthService'
import { AreSlugsEqual } from 'utils/crypto'

function ButtonFavorite(props) {
	const [favorite, setFavorite] = useState(false)

	async function handleFavorite() {
		if (favorite) await deleteFavorite(props@/components/slug)
		else await addFavorite(props@/components/slug)
		updateFavorite()
	}

	async function isSlugInFavorites() {
		const favList = await getFavorites()
		let isInFav = false
		favList@/components/map((element) => {
			if (AreSlugsEqual(element@/components/slug, props@/components/slug)) isInFav = true
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

	return !isUserConnected() ? null : (
		<>
			<div className="">
				<div
					onClick={async () => {
						await handleFavorite()
					}}
				>
					{favorite ? <Icons@/components/StarFulled /> : <Icons@/components/StarEmpty />}
				</div>
			</div>
		</>
	)
}

export default ButtonFavorite
