import ProfileHeader from '@/components/ProfileHeader'
import ProfileAlerts from '@/components/ProfileAlerts'
import ProfileFavorite from '@/components/ProfileFavorite'
import { useState, useEffect } from 'react'
import { getUser, removeSession } from 'services/UserService'
import ProfilePurge from '@/components/ProfilePurge'
import Layout from '@/layouts/Layout'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { deleteCookie, getCookie } from 'services/CookieService'
import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'

const CURRENCY = 'USD'

const Profile = () => {
	const [viewState, setViewState] = useState(true)
	const [user, setUser] = useState(undefined)
	const router = useRouter()

	async function removeUserSession() {
		await removeSession()
		const data = await getUser()
		setUser(data)
	}

	async function getCurrentUser() {
		getUser().then((res) => setUser(res))
	}

	useEffect(() => {
		if (getCookie('token') === undefined) {
			router.push('/')
		} else {
			getCurrentUser().then((res) => setUser(res))
		}
	}, [])

	return (
		<>
			{
				(user === undefined)
					?
						<div className='column center'>
							<CircularProgress color='secondary' />
						</div>
					:
						<div className="column principal first layer4">
							<div className="center">{user !== undefined && <ProfileHeader user={user} updateUser={getCurrentUser} />}</div>
							<div>
								<div className="row center">
									<button
										className={viewState ? 'profile-nav-selected' : 'profile-nav'}
										onClick={() => setViewState(true)}
									>
										Alertes
									</button>
									<button
										className={viewState ? 'profile-nav' : 'profile-nav-selected'}
										onClick={() => setViewState(false)}
									>
										Favoris
									</button>
								</div>
								<hr className="line"></hr>
							</div>
							<div className="column center">
								{viewState ? <ProfileAlerts currency={CURRENCY} /> : <ProfileFavorite />}
							</div>
							<hr className="line"></hr>
							<div>{user !== undefined && <ProfilePurge user={user} removeSession={removeUserSession} />}</div>
						</div>
			}
		</>
	)
}

Profile.getLayout = function getLayout(page) {
	const { t } = useTranslation('common')

	return (
		<Layout
			pageMeta={{
				title: t('pages.profile.title'),
				description: t('pages.profile.description')
			}}
		>
			{page}
		</Layout>
	)
}

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'profile']))
		}
	}
}

export default Profile
