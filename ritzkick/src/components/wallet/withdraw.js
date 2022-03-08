import React, { useState, useEffect } from 'react'
import { useForm } from '../hooks/useForm'
import { addTransaction, createWallet } from '../../../services/UserService'
import Icons from '../../components/Icons'
import Functions from 'services/CryptoService'
import {
	Alert,
	Snackbar,
	FormControl,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Select,
	MenuItem,
	FormHelperText
} from '@mui/material'

const CURRENCY = 'usd'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
}

function WalletWithdraw(props) {
	const [state, handleChange] = useForm()
	const [date] = useState(new Date().toISOString().slice(0, 10))
	const [data, setData] = useState()

	async function handleSubmit(e) {
		e.preventDefault()
		await addTransaction(state.asset.toLowerCase(), state.boughtAt, state.price * -1, state.date)
		window.location.reload()
	}

	function compare(a, b) {
		if (a.name < b.name) return -1
		if (a.name > b.name) return 1
		return 0
	}

	function parseData() {
		let parsedData = []
		if (data !== undefined) {
			let datas = data.sort(compare)
			datas.forEach((element) => {
				let tempValue = {
					label: element.name,
					value: element.symbol
				}
				parsedData.push(tempValue)
			})
		}
		return parsedData
	}

	useEffect(async () => {
		const values = await Functions.GetAllCryptocurrencySlugs(1, 1000)
		setData(values.assets)
	}, [])

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
				<Select name="asset" defaultValue="" onChange={handleChange} MenuProps={MenuProps} required>
					{parseData().map((crypt) => (
						<MenuItem key={crypt.value} value={crypt.value}>
							{crypt.label}
						</MenuItem>
					))}
				</Select>
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