import React, { useEffect, useState } from 'react'
import { getWatchList } from '../services/UserService'
import ProfileAddAlerts from './ProfileAddAlerts'

export default function ProfileAlerts() {
	let [data, setData] = useState([])

	useEffect(() => {
		getWatchList()
			.then((res) => {
				console.log(res)
				setData(res)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	return (
		<div id="alerts">
			<div id="alerts-header" className="row">
				<h1>Alerts</h1>
				<ProfileAddAlerts />
			</div>
			<ul>
				{data.map((alert) => (
					<li key={alert._id}>{alert.asset}</li>
				))}
			</ul>
		</div>
	)
}
