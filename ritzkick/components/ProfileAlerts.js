import React, { useEffect, useState } from 'react'
import { getWatchList } from '../services/UserService'
import ProfileAddAlerts from './ProfileAddAlerts'
import ProfileAlertsComponent from './ProfileAlertsComponent'

export default function ProfileAlerts() {
	let [data, setData] = useState([])

	function fetchData() {
		getWatchList()
			.then((res) => {
				setData(res)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<div id="alerts">
			<div id="alerts-header" className="row">
				<h1>Alertes</h1>
				<ProfileAddAlerts onDataChange={fetchData} />
			</div>
			<ul>
				{data.map((alert) => (
					<li key={alert._id}>
						<ProfileAlertsComponent onDataChange={fetchData} alert={alert} />
					</li>
				))}
			</ul>
		</div>
	)
}
