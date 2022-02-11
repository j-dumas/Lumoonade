import React, {useState} from 'react'
import SimpleCryptoDashboard from './SimpleCryptoDashboard'
import GetCryptoData from '../services/CryptoService'


export default function ProfileFavorite() {
  // const [data, setData] = useState(GetCryptoData())


  return (
    <div id='favorites'>
        <h1>Favoris</h1>
        {/* <SimpleCryptoDashboard data={data} /> */}
    </div>
  )
}
