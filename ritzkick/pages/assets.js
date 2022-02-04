import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Icons from '../components/Icons'
import BottomArrow from '../components/BottomArrow'
import SimpleCryptoDashboard from '../components/SimpleCryptoDashboard'
import React, {useState, useEffect} from 'react';
import SimpleCryptoCard from '../components/SimpleCryptoCard'

export default function Assets() {
    const [data, setData] = useState([
        {
            name: "Bitcoin",
            abbreviation: 'BTC',
            price: 50000,
            x: ['10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h', '21h', '22h','23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h'], 
            value: [49000, 48000,49000,49500,49550,49000,50000,50000,50050,50000,51000,49000,49500, 49550,50000,50000,55000,50500,50500,49000,49000,49000,48000,50000]
        },
        {
            name: "Ethereum",
            abbreviation: 'ETH',
            price: 3400,
            x: ['10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h', '21h', '22h','23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h'], 
            value: [3400, 3300,3400,3450,3500,3500,3550,3350,3400,3500,3400,3400,3300, 3300,3400,3450,3500,3500,3550,3350,3400,3500,3400,3400]
        },
        {
            name: "Ethereum",
            abbreviation: 'ETH',
            price: 3400,
            x: ['10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h', '21h', '22h','23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h'], 
            value: [50000, 3300,3400,3450,3500,3500,3550,3350,3400,3500,3400,3400,3300, 3300,3400,3450,3500,3500,3550,3350,3400,3500,3400,3400]
        },
    ]);

  return (
    <div>
      <DomHead/>
      <Header/>

      <section className='section row center principal first'>
        {data.map((element,i) => {
            return (
            <>
                <SimpleCryptoCard data={element}/>
            </>
        )})}
      </section>
      
			<Footer />

			<div className='cursor'></div>
		</div>
	)
}