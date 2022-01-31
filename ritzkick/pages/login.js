import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import LoginForm from '../components/LoginForm'
import Bubbles from '../components/Bubbles'

export default function Login() {
    return (
        <div>
          <DomHead/>
          <main>
            <LoginForm />
            <Bubbles />
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}