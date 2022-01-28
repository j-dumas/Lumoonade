import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Icons from '../components/Icons'
import BottomArrow from '../components/BottomArrow'

const TITLE = "KRYPTOW"
const SUB_TTTLE = "Forget those crapy crypto wallet"
const SUB_TITLE_2 = 'Get your keys safe!'
export default function Home() {
  return (
    <div>
      <DomHead/>

      <main className='column'>
        <section className='section row principal center'>
          <div className='column center'>
            <div className='column center'>
              <div className='website-title item'>
                {TITLE}
                <div className="particletext bubbles row"></div>
              </div>
              <h2 className='subtitle item'>{SUB_TTTLE}</h2>
              <h3 className='subtitle item'>{SUB_TITLE_2}</h3>
            </div>
          </div>
        </section>
        <BottomArrow/>        
      </main>

      <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fillOpacity="1" d="M0,96L17.1,85.3C34.3,75,69,53,103,64C137.1,75,171,117,206,117.3C240,117,274,75,309,96C342.9,117,377,203,411,218.7C445.7,235,480,181,514,144C548.6,107,583,85,617,74.7C651.4,64,686,64,720,80C754.3,96,789,128,823,149.3C857.1,171,891,181,926,192C960,203,994,213,1029,197.3C1062.9,181,1097,139,1131,117.3C1165.7,96,1200,96,1234,101.3C1268.6,107,1303,117,1337,144C1371.4,171,1406,213,1423,234.7L1440,256L1440,320L1422.9,320C1405.7,320,1371,320,1337,320C1302.9,320,1269,320,1234,320C1200,320,1166,320,1131,320C1097.1,320,1063,320,1029,320C994.3,320,960,320,926,320C891.4,320,857,320,823,320C788.6,320,754,320,720,320C685.7,320,651,320,617,320C582.9,320,549,320,514,320C480,320,446,320,411,320C377.1,320,343,320,309,320C274.3,320,240,320,206,320C171.4,320,137,320,103,320C68.6,320,34,320,17,320L0,320Z"></path></svg>
        
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
