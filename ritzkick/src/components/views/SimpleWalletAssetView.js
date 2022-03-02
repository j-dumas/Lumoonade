import React, { useState, useEffect } from 'react'
import SimpleChart from '@/components/charts/SimpleChart'
import Icons from '@/components/Icons'
import format from '../../../utils/formatter'
import {isUserConnected} from '../../../services/AuthService'
import ButtonFavorite from '../ButtonFavorite'
import Image from 'next/image'

function SimpleCryptoView(props) {
    console.log(props.data)
	return (
		<>
			<a href={'/asset/' + props.data.fromCurrency.toString().toLowerCase()} className="simple-crypto-view row center">
				<div className='sub-section row space-between'>
                    <div className="simple-crypto-view-item-big row left h-center">
                        <Image src={'/'+props.data.fromCurrency + '.svg'} width={25} height={25}></Image>
                        <p>{props.data.shortName}</p>
                    </div>

                    <p className="simple-crypto-view-item c-font-2">$ {format(props.data.regularMarketPrice)}</p>

                    <p className="simple-crypto-view-item">{props.asset.amount} {props.asset.name.toString().toUpperCase()}</p>
                    <p className="simple-crypto-view-item">$ {format(props.asset.totalSpent)}</p>

                    {(props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent) >= 0 ?
                    <p className="simple-crypto-view-item increase">
                        +{format((props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)/props.asset.totalSpent*100)}% &nbsp; +{format(props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)}$
                    </p>
                    :
                    <p className="simple-crypto-view-item decrease">
                        {format((props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)/props.asset.totalSpent*100)}% &nbsp; {format(props.data.regularMarketPrice*props.asset.amount-props.asset.totalSpent)}$
                    </p>}

                    <p className="simple-crypto-view-item">
                        $ {format(props.data.regularMarketPrice*props.asset.amount)}
                    </p>

                    {!isUserConnected()? <></> :
                    <ButtonFavorite slug={props.data.fromCurrency.toString().toLowerCase()}/>}
				</div>
			</a>
		</>
	)
}
export default SimpleCryptoView
