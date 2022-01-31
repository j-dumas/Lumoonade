import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import Bubbles from '../components/Bubbles'

export default function ForgotPassword() {
    return (
        <div>
          <DomHead/>
          <main className='row'>
            <Bubbles />
            <ForgotPasswordForm />
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}