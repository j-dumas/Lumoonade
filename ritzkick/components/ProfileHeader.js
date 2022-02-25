import React, { useEffect, useState } from 'react'
import ProfilePopup from './ProfilePopup'
import { removeSession, getUser } from '../services/UserService'

const usernameTitleId = 'username'
const memberSinceId = 'memberSince'

export default function ProfileHeader(){
	const [state, setState] = useState({user: {}})

	async function removeUserSession(event) {
		await removeSession()
		const data = await getUser()
		setState({ user: data })
	}

	function getMonth(monthNumber) {
		const month = [
			'janvier',
			'février',
			'mars',
			'avril',
			'mai',
			'juin',
			'juillet',
			'août',
			'septembre',
			'octobre',
			'novembre',
			'décembre'
		]

		return month[monthNumber - 1]
	}

	function parseTime(createdAt) {
		if(createdAt !== undefined){
			let dateSliced = createdAt.split('-')
			let year = dateSliced[0]
			let month = dateSliced[1]
			let day = dateSliced[2].substring(0, 2)
	
			return 'Membre depuis le ' + parseInt(day) + ' ' + getMonth(parseInt(month)) + ' ' + year
		}
	}

	useEffect(() => {
		getUser().then((res) => setState({user: res}))
	}, [])

	return (
		<div>
			<div className="profile-header" id="header">
				<div className="row">
					<div className="column profile-card">
						<ProfilePopup username={state.user.username} email={state.user.email} />
						<div className="row h-center">
							<img id="profile-picture" src="/ETH.svg"></img>
							<h1 id={usernameTitleId}>{state.user.username}</h1>
						</div>
						<div className="row information">
							<div>
								<h3 id={memberSinceId}>{parseTime(state.user.createdAt)}</h3>
							</div>
						</div>
					</div>
					<div className="profile-card center">
						<h2>Vous avez présentement {state.user.sessions} session(s) active(s)</h2>
						<button
							id="purge-session"
							onClick={(event) => {
								removeUserSession(event)
							}}
						>
							Effacer les sessions inutiles
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
