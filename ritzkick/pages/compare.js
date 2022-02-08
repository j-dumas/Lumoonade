import React, { useState, useEffect } from 'react'
import DomHead from '../components/DomHead'
import Header from '../components/Header'
import Footer from '../components/Footer'
//import DetailedChart from '../components/DetailedChart';
import GetCryptoData from '../services/CryptoService'

import dynamic from 'next/dynamic'

const DetailedCryptoView = dynamic(
    () => {
        //return import('../components/DetailedChart')
        return import('../components/DetailedCryptoView')
    },
    {ssr:false}
)

// <DetailedCharts getChartDatas={() => GetCryptoChartData()} dateRange={'1D'} interval={'1min'} />
export default function Home() {
    const [data, setData] = useState();

    return (
        <>
            <DomHead/>
            <Header/>
            
            <section className='section row principal center first'>
                <DetailedCryptoView data={GetCryptoData()} slug="ETH" />
            </section>

			<Footer />
		</>
	)
}
