import React, {useState, useEffect} from 'react';
import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
//import DetailedChart from '../components/DetailedChart';
import GetCryptoChartData from '../services/CryptoService'

import dynamic from 'next/dynamic'

const DetailedCharts = dynamic(
    () => {
        return import('../components/DetailedChart')
    },
    {ssr:false}
)

export default function Home() {
    const [data, setData] = useState();
/*
    useEffect(() => {
        async function getChartData() {
          let response = await GetCryptoChartData()
          setData(response)
        }

        getChartData()

        const interval = setInterval(() => {
            getChartData()
            console.log('This will run every second!');
        }, 1000);
        return () => clearInterval(interval);
      }, [])
*/
    return (
        <>
            <DomHead/>
            <Header/>
            
            <section className='section row principal center first'>
                <DetailedCharts data={data}/>
            </section>

            <Footer />
		</>
	)
}
