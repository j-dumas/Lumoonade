import React, {useState, useEffect} from 'react'
import Functions, {
    GetCryptocurrencyInformationsBySlug,
    GetTopPopularCryptocurrencies,
    GetTopEfficientCryptocurrencies
} from '../services/CryptoService'
import dynamic from 'next/dynamic'
import DetailedChartMenu from './DetailedChartMenu'

const DetailedChartChart = dynamic(
    () => {
        return import('./DetailedChartChart')
    },
    {ssr:false}
)

function DetailedChart(props) {
    // Validation:
    if (!props.slug) return <div>Impossible action.</div>

    const [showPrice, setShowPrice] = useState(true)
    const [showChange, setShowChange] = useState(false)
    const [showVolume, setShowVolume] = useState(false)
    const [dateRange, setDateRange] = useState("5D")
    const [interval, setInterval] = useState("15m")

    return (
        <div className='detailed-chart detailed-div'>
            <DetailedChartMenu sendDateRange={setDateRange} sendInterval={setInterval}/>
            <DetailedChartChart slug="ETH-CAD" dateRange={dateRange} interval={interval}/>
        </div>
    )
}

export default DetailedChart