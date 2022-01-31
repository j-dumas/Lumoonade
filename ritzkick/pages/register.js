import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import RegisterForm from '../components/RegisterForm'
import Bubbles from '../components/Bubbles'

export default function Login() {
    return (
        <div>
          <DomHead/>
          <main className='row'>
            <RegisterForm/>
            <Bubbles />
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}