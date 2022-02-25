import DomHead from '../src/components/DomHead'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import ProfileHeader from '../src/components/ProfileHeader'
import ProfileAlerts from '../src/components/ProfileAlerts'
import ProfileFavorite from '../src/components/ProfileFavorite'

export default function profile() {
	return (
		<div>
			<DomHead />
			<Header />
			<main>
				<div className="column center">
					<ProfileHeader />
					<ProfileAlerts />
					<ProfileFavorite />
				</div>
			</main>
			<Footer />
			<div className="cursor"></div>
		</div>
	)
}
