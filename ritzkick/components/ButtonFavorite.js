import React, { useState, useEffect } from 'react'
import Icons from './Icons'

function ButtonFavorite() {
	const [favorite, setFavorite] = useState(false)
	const handleFavorite = () => {
		setFavorite(!favorite)
		// HandleUserFavorite(favorite)
	}

	return (
		<>
			<div className="">
				<div onClick={handleFavorite}>{favorite ? <Icons.StarEmpty /> : <Icons.StarFulled />}</div>
			</div>
		</>
	)
}

export default ButtonFavorite
