import React from 'react'
import ProfilePopup from '@/components/ProfilePopup'

import { useTranslation } from 'next-i18next'

const usernameTitleId = 'username'
const memberSinceId = 'memberSince'

export default function ProfileHeader(props) {
	const { t } = useTranslation('profile')

	function getMonth(monthNumber) {
		const months = [
			t('header.months.january'),
			t('header.months.february'),
			t('header.months.march'),
			t('header.months.april'),
			t('header.months.may'),
			t('header.months.june'),
			t('header.months.july'),
			t('header.months.august'),
			t('header.months.september'),
			t('header.months.october'),
			t('header.months.november'),
			t('header.months.december')
		]
		return months[monthNumber - 1]
	}

	function parseTime(createdAt) {
		if (createdAt !== undefined) {
			let dateSliced = createdAt.split('-')
			let year = dateSliced[0]
			let month = dateSliced[1]
			let day = dateSliced[2].substring(0, 2)

			return `${t('header.member')} ${parseInt(day)} ${getMonth(parseInt(month))} ${year}`
		}
	}

	return (
		<div className="profile-header" id="header">
			<div className="profile-card">
				<ProfilePopup
					username={props.user.username}
					email={props.user.email}
					updateUser={props.updateUser}
					provenance={false}
				/>
				<div className="column center">
					<img id="profile-picture" src="/themoon-t.png" alt="profil avatar"></img>
					<h1 id={usernameTitleId}>{props.user.username}</h1>
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
