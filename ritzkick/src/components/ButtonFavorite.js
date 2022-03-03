import React, { useCallback, useEffect, useState } from 'react'
import { addFavorite, deleteFavorite, getFavorites } from 'services/UserService'
import Icons from '@/components/Icons'
import { isUserConnected } from 'services/AuthService'
import { AreSlugsEqual } from 'utils/crypto'

function ButtonFavorite(props) {
	const [favorite, setFavorite] = useState(false)

	async function handleFavorite() {
		if (favorite) await deleteFavorite(props.slug)
		else await addFavorite(props.slug)
		updateFavorite()
	}

	const isSlugInFavorites = useCallback(() => {
		async function checkFavorite() {
			const favList = await getFavorites()
			let isInFav = false
			favList.map((element) => {
				if (AreSlugsEqual(element.slug, props.slug)) isInFav = true
			})
			return isInFav
		}
		return checkFavorite()
	}, [props.slug])

	const updateFavorite = useCallback(() => {
		async function prepareFavorites() {
			let bool = await isSlugInFavorites()
			setFavorite(bool)
		}
		prepareFavorites()
	}, [isSlugInFavorites])

	useEffect(() => {
		updateFavorite()
	}, [updateFavorite])

	return !isUserConnected() ? null : (
		<>
			<div className="">
				<div
					onClick={async () => {
						await handleFavorite()
					}}
				>
					{favorite ? <Icons.StarFulled /> : <Icons.StarEmpty />}
				</div>
			</div>
		</>
	)
}

export default ButtonFavorite
