import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Icons from '../components/Icons'
import BottomArrow from '../components/BottomArrow'

const TITLE = "CRYPTOOL"
const SUB_TTTLE = "Restez à l'affut de vos cryptos favorites"
// <div className="particletext bubbles row"></div>
export default function Home() {
  return (
    <div>
      <DomHead/>

      <main className='column'>
        <section className='section row principal center'>
          <div className='column center'>
            <div className='column center'>
              <h1 className='website-title item'>{TITLE}</h1>
              <h2 className='subtitle item'>{SUB_TTTLE}</h2>
            </div>
          </div>
        </section>
        <BottomArrow/>        
      </main>

      <svg className='svg svg-transit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,128L205.7,192L411.4,128L617.1,192L822.9,32L1028.6,64L1234.3,192L1440,96L1440,320L1234.3,320L1028.6,320L822.9,320L617.1,320L411.4,320L205.7,320L0,320Z"></path></svg> 
      <section className='section row second'>
        <div className='division'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error repellendus reiciendis optio odit dolores blanditiis esse amet veniam itaque excepturi dolorem quas recusandae, eligendi voluptas, ut tempore assumenda et tempora?</p>
        </div>
        <div className='division'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad non dolorum est obcaecati, vero vitae architecto exercitationem culpa ex laboriosam blanditiis distinctio inventore dicta totam minus, alias unde voluptates fuga.</p>
        </div>
      </section>
      
      <Footer/>

      <div className='cursor'></div>
    </div>
  )
}
