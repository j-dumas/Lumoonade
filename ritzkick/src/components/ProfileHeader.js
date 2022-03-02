import React from 'react'
import ProfilePopup from '@/components/ProfilePopup'

const usernameTitleId = 'username'
const memberSinceId = 'memberSince'

export default function ProfileHeader(props) {

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
		if (createdAt !== undefined) {
			let dateSliced = createdAt.split('-')
			let year = dateSliced[0]
			let month = dateSliced[1]
			let day = dateSliced[2].substring(0, 2)

			return 'Membre depuis le ' + parseInt(day) + ' ' + getMonth(parseInt(month)) + ' ' + year
		}
	}

	return (
<<<<<<< HEAD
		<div className="profile-header" id="header">
			<div className='center row'>
				<div className="profile-card">
					<ProfilePopup username={props.user.username} email={props.user.email} />
					<img id="profile-picture" src="/ETH.svg"></img>
					<h1 id={usernameTitleId}>{props.user.username}</h1>
					<div className="information">
						<div>
							<h3 id={memberSinceId}>{parseTime(props.user.createdAt)}</h3>
=======
		<div>
			<div className="profile-header" id="header">
				<div className="row">
					<div className="column profile-card">
						<ProfilePopup username={state.user.username} email={state.user.email} />
						<div className="row h-center">
							<img id="profile-picture" src="/ETH.svg" alt=""></img>
							<h1 id={usernameTitleId}>{state.user.username}</h1>
>>>>>>> develop
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
