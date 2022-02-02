import DomHead from '../components/DomHead'
import Footer from '../components/Footer'
import LoginForm from '../components/LoginForm'
import Bubbles from '../components/Bubbles'
import Header from '../components/Header'

export default function Login() {
    return (
        <div>
          <DomHead/>
          <Header/>
          <main>
            <LoginForm />
            <Bubbles />
            <div  className="spacer layer1"></div>
          </main>
          <Footer/>
          <div className='cursor'></div>
        </div>
      )
}