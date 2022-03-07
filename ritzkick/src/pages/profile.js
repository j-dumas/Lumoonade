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

	useEffect(() => {
		if(getCookie("token") === undefined){
			router.push("/")
		}else {
			getUser().then((res) => setUser(res))
		}
	}, [])

	return (
		<>
			<main>
				<div className="column page-navbar">
					<div className="center">{user !== undefined && <ProfileHeader user={user} />}</div>
					<div>
						<div className="row center no-margin">
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
					<div className="column center">{viewState ? <ProfileAlerts currency={CURRENCY}/> : <ProfileFavorite />}</div>
					<hr className="line"></hr>
					<div>{user !== undefined && <ProfilePurge user={user} removeSession={removeUserSession} />}</div>
				</div>
				<div className="spacer layer4"></div>
			</main>
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
