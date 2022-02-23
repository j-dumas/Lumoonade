import React, { useState, useEffect } from 'react'
import {getFavorites, addFavorite, deleteFavorite} from '../services/UserService'
import Icons from './Icons'
import {isUserConnected} from '../services/CookieService'

function ButtonFavorite(props) {
	const [favorite, setFavorite] = useState(false)
	const handleFavorite = () => {
		setFavorite(!favorite)
		// HandleUserFavorite(favorite)
	}

	useEffect(async () => {
		if (!isUserConnected()) return
		
	}, [favorite])

	return (
		!isUserConnected() ? null :
		<>
			<div className="">
				<div onClick={handleFavorite}>{favorite ? <Icons.StarEmpty /> : <Icons.StarFulled />}</div>
			</div>
		</>
	)
}

export default ButtonFavorite
