import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import LoginForm from '../components/LoginForm'
import Clouds from '../components/Clouds'

export default function Login() {
    return (
        <div>
          <DomHead/>
          <main className='row'>
            <section className='section column center'>
                <Clouds />
            </section>
            <LoginForm />
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}