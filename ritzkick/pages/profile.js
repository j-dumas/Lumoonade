import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileHeader from '../components/ProfileHeader'


export default function profile() {
    return (
        <div>
          <DomHead/>
          <Header />
          <main>
            <ProfileHeader />
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}