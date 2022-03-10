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
		<div className="profile-header" id="header">
			<div className="profile-card">
				<div className="column center">
					<img id="profile-picture" src="/ETH.svg"></img>
					<div className="row center">
						<h1 id={usernameTitleId}>{props.user.username}</h1>
						<ProfilePopup
							username={props.user.username}
							email={props.user.email}
							updateUser={props.updateUser}
							provenance={false}
						/>
					</div>
					<div className="information">
						<div>
							<h3 id={memberSinceId}>{parseTime(props.user.createdAt)}</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
