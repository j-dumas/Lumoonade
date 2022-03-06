import React, { useState, useEffect } from 'react'
import {useForm} from '../hooks/useForm'
import {addTransaction, createWallet} from '../../../services/UserService'
import Icons from '../../components/Icons'

const CURRENCY = 'usd'

function WalletDeposit(props) {
    const [state, handleChange] = useForm()

    async function handleSubmit() {
        await addTransaction(state.asset.toLowerCase(), state.boughtAt, state.price, state.date)
		window.location.reload()
    }

	return (
		<div className={props.isOpen?'wallet':'no-display'}>
			<div className='wallet-form column'>
				<div className='row space-between'>
					<p>Deposit</p>
					<div onClick={props.close}><Icons.Times/></div>
				</div>
				
				<label htmlFor="asset">Asset</label>
				<input name='asset' onChange={handleChange} className='wallet-input' type="text" required/>
				<label htmlFor="boughtAt">Bought at</label>
				<input name='boughtAt' onChange={handleChange} className='wallet-input' type="number" required/>
				<label htmlFor="price">Amount (price)</label>
				<input name='price' onChange={handleChange} className='wallet-input' type="number" required/>
				<label htmlFor="date">Date</label>
				<input name='date' onChange={handleChange} className='wallet-input' type="date" required/>
				<button onClick={handleSubmit}>Deposit</button>
			</div>
		</div>
	)
}
export default WalletDeposit
