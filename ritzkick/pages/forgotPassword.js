import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import Clouds from '../components/Clouds'

export default function ForgotPassword() {
    return (
        <div>
          <DomHead/>
          <main className='row'>
            <Clouds />
            <ForgotPasswordForm />
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}