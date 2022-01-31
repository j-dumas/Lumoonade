import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import RegisterForm from '../components/RegisterForm'
import Clouds from '../components/Clouds'

export default function Login() {
    return (
        <div>
          <DomHead/>
          <main className='row'>
            <section className='section column center'>
                <Clouds />
            </section>
            <RegisterForm/>
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}