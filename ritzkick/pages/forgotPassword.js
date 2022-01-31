import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import Clouds from '../components/Clouds'

export default function ForgotPassword() {
    return (
        <div>
          <DomHead/>
          <main className='row'>
            <section className='section column center'>
                <Clouds />
                <ForgotPasswordForm />
            </section>
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}