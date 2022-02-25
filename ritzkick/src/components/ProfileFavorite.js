import React, { useEffect, useState } from 'react'
import SimpleCryptoDashboard from './SimpleCryptoDashboard'
import { getFavorites } from '../../services/UserService'

export default function ProfileFavorite() {
	const [data, setData] = useState([])

	useEffect(() => {
		getFavorites()
			.then((res) => setData(res))
			.catch((e) => console.log(e))
	}, [])

	return (
		<div id="favorites">
			<h1>Favoris</h1>
			<ul>
				{data.map((favorites) => (
					<li key={favorites._id}>{favorites.slug}</li>
				))}
			</ul>
		</div>
	)
}
