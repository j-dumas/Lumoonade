import React, { useState, useEffect } from 'react'
import {useForm} from '../hooks/useForm'
import {addTransaction, createWallet} from '../../../services/UserService'
import Icons from '../../components/Icons'

const CURRENCY = 'usd'

function WalletWithdraw(props) {
    const [state, handleChange] = useForm()

    async function handleSubmit(e) {
        await addTransaction(state.asset.toLowerCase(), state.boughtAt,  state.price*-1, state.date)
        window.location.reload()
    }

	return (
		<div className={props.isOpen?'wallet':'no-display'}>
            <div className='wallet-form column' onSubmit={handleSubmit} method="POST">
                <div className='row space-between'>
					<p>Withdraw</p>
					<div onClick={props.close}><Icons.Times/></div>
				</div>
                <label htmlFor="asset">Asset</label>
                <input name='asset' onChange={handleChange} className='wallet-input' type="text" required/>
                <div className='row space-between'>
                    <div className='column'>
                        <label htmlFor="boughtAt">Withdraw at</label>
                        <input name='boughtAt' onChange={handleChange} className='wallet-input' type="number" required/>
                    </div>                            
                    <div className='column'>
                        <label htmlFor="price">Amount (price)</label>
                        <input name='price' onChange={handleChange} className='wallet-input' type="number" required/>
                    </div>
                </div>
                <label htmlFor="date">Date</label>
                <input name='date' onChange={handleChange} className='wallet-input' type="date" required/>
                <button type="submit" value="Submit">Withdraw</button>
            </div>
		</div>
	)
}

export default WalletWithdraw
