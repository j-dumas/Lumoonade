import React, { useCallback, useEffect, useState } from 'react'
import { addFavorite, deleteFavorite, getFavorites } from 'services/UserService'
import Icons from '@/components/Icons'
import { isUserConnected } from 'services/AuthService'
import { AreSlugsEqual, SymbolToSlug } from 'utils/crypto'
import { DriveEtaOutlined } from '@mui/icons-material'

function ButtonFavorite(props) {
	const [favorite, setFavorite] = useState(false)

	async function handleFavorite() {
		if (favorite) await deleteFavorite(SymbolToSlug(props.slug))
		else await addFavorite(SymbolToSlug(props.slug))
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

	const handleClick = async (event) => {
		event.stopPropagation()
		console.log('clicked')
		await handleFavorite()
		console.log(props.refresh)
	}

	return !isUserConnected() ? null : (
		<>
			<div className="fav-button">
				<div onClick={handleClick}>{favorite ? <Icons.StarFulled /> : <Icons.StarEmpty />}</div>
			</div>
		</>
	)
}

export default ButtonFavorite
