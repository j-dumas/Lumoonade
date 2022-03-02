import DomHead from '@/components/DomHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProfileHeader from '@/components/ProfileHeader'
import ProfileAlerts from '@/components/ProfileAlerts'
import ProfileFavorite from '@/components/ProfileFavorite'
import { useState, useEffect } from 'react'
import { getUser, removeSession } from 'services/UserService'
import ProfilePurge from '@/components/ProfilePurge'


export default function profile() {
	const [viewState, setViewState] = useState(true)
	const [user, setUser] = useState(undefined)

	async function removeUserSession(){
		await removeSession()
		const data = await getUser()
		setUser(data)
	}

	useEffect(() => {
		getUser().then((res) => setUser(res))
	}, [])

	return (
		<div>
			<DomHead />
			<Header />
			<main>
				<div className='column page-navbar'>
					<div className="center">
						{
							(user !== undefined) && <ProfileHeader user={user} /> 
						}
					</div>
					<div>
						<div className='row center no-margin'>
							<button className={ viewState ? 'profile-nav-selected' : 'profile-nav'} onClick={() => setViewState(true)}>Alertes</button>
							<button className={ viewState ? 'profile-nav' : 'profile-nav-selected'} onClick={() => setViewState(false)}>Favoris</button>
						</div>
						<hr className='line'></hr>
					</div>
					<div className='column center'>
						{
							viewState ? <ProfileAlerts /> : <ProfileFavorite />
						}
					</div>
					<hr className='line'></hr>
					<div>
						{ (user !== undefined) && <ProfilePurge user={user} removeSession={removeUserSession} /> }
					</div>
				</div>
				<div className="spacer layer4"></div>
			</main>
			<Footer />
		</div>
	)
}
