import React, { useEffect, useState } from 'react'
import SimpleCryptoDashboard from '@/components/SimpleCryptoDashboard'
import { getFavorites } from 'services/UserService'
import ButtonFavorite from './ButtonFavorite'

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
					<li key={favorites._id}>
						<ButtonFavorite slug={favorites.slug} />
					</li>
				))}
			</ul>
		</div>
	)
}
