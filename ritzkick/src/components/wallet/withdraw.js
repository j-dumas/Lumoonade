import React, { useState, useEffect } from 'react'
import { useForm } from '../hooks/useForm'
import { addTransaction, createWallet } from '../../../services/UserService'
import Icons from '../../components/Icons'

const CURRENCY = 'usd'

function WalletWithdraw(props) {
	const [state, handleChange] = useForm()
	const [date] = useState(new Date().toISOString().slice(0, 10))

	async function handleSubmit(e) {
		e.preventDefault()
		await addTransaction(state.asset.toLowerCase(), state.boughtAt, state.price * -1, state.date)
		window.location.reload()
	}

	return (
		<div className={props.isOpen ? 'wallet' : 'no-display'}>
			<form className="wallet-form column" onSubmit={handleSubmit}>
				<div className="row space-between">
					<p>Withdraw</p>
					<div onClick={props.close}>
						<Icons.Times />
					</div>
				</div>
				<label htmlFor="asset">Asset</label>
				<input name="asset" onChange={handleChange} className="wallet-input" type="text" required />
				<label htmlFor="boughtAt">Withdraw at</label>
				<input name="boughtAt" onChange={handleChange} className="wallet-input" type="number" required />
				<label htmlFor="price">Amount (price)</label>
				<input name="price" onChange={handleChange} className="wallet-input" type="number" required />
				<label htmlFor="date">Date</label>
				<input
					name="date"
					max={date}
					value={date}
					onChange={handleChange}
					className="wallet-input"
					type="date"
					required
				/>
				<button type="submit" value="Submit">
					Withdraw
				</button>
			</form>
		</div>
	)
}

export default WalletWithdraw
