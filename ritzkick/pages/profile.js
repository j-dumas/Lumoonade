import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileHeader from '../components/ProfileHeader'
import ProfileAlerts from '../components/ProfileAlerts'
import ProfileFavorite from '../components/ProfileFavorite'


export default function profile() {
    return (
        <div>
          <DomHead/>
          <Header />
          <main>
            <div className='column center'>
              <ProfileHeader />
              <ProfileAlerts />
              <ProfileFavorite />
            </div>
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}
