import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal'
import Icons from './Icons'
import { addWatch } from '../../services/UserService'
import { Alert, Snackbar, FormControl, InputAdornment, InputLabel, OutlinedInput, Select, MenuItem, FormHelperText } from '@mui/material'
import { useForm } from './hooks/useForm'

const data = [
	{
		slug: 'btc',
		name: 'Bitcoin',
		price: 50000
	},
	{
		slug: 'eth',
		name: 'Etherium',
		price: 5000
	}
]

function parseData() {
	let parsedData = []
	data.forEach((element) => {
		let tempValue = {
			label: element.name,
			value: element.slug
		}
		parsedData.push(tempValue)
	})
	return parsedData
}

export default function ProfileAddAlerts(props) {
	const [state, handleChange, resetState] = useForm({})
	const [Modal, open, close, isOpen] = useModal('alerts-header', {
		preventScroll: true,
		closeOnOverlayClick: true
	})
	const [openStatus, setOpen] = useState(false)
	const [price, setPrice] = useState(0)
	const [minPrice, setMinPrice] = useState(0)
	const [maxPrice, setMaxPrice] = useState(0)


	function getPrice(slug){
		data.forEach((element) => {
			if(element.slug === slug){
				console.log(element.price)
				setPrice(element.price)
			}
		})	
	}

	
	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}
		
		setOpen(false)
	}
	
	useEffect(() => {
		if(state.slug !== undefined){
			getPrice(state.slug)
		}
		if(state.parameter !== undefined){
			if(state.parameter === 'lte'){
				setMinPrice(0)
				setMaxPrice(price)
			}
			else{
				setMinPrice(price)
				setMaxPrice(Infinity)
			}
		}
	}, [state])

	useEffect(() => {
		if (!isOpen) {
			resetState()
		}
	}, [isOpen])

	async function handleSubmit(event) {
		event.preventDefault()
		await addWatch(state)
		props.onDataChange()
		close()
		setOpen(true)
	}

	return (
		<div>
			<button className="icon-button transform" id="rotate-button" onClick={open}>
				<Icons.Times />
			</button>
			<Snackbar
				sx={{ m: 6 }}
				open={openStatus}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
			>
				<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
					Alerte ajoutée!
				</Alert>
			</Snackbar>
			<Modal>
				<div className="edit-popup">
					<h1>Ajouter une alerte</h1>
					<p>
						L&apos;alerte nous permet de vous envoyez un courriel lorsque la condition que vous entrez
						n&apos;est pas respectée
					</p>
					<form className="row" onSubmit={(event) => handleSubmit(event)}>
						<FormControl sx={{ m: 1, width: '25%' }} className="inputField" variant="filled">
							<InputLabel>Crypto</InputLabel>
							<Select
								name="slug"
								defaultValue=""
								onChange={handleChange}
								required
							>
								{parseData().map((crypt) => (
									<MenuItem key={crypt.value} value={crypt.value}>
										{crypt.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ m: 1, width: '30%' }} className="inputField" variant="filled">
							<InputLabel>Symbole</InputLabel>
							<Select
								name="parameter"
								defaultValue=""
								onChange={handleChange}
								required
							>
								<MenuItem value="lte">Moins que la valeur</MenuItem>
								<MenuItem value="gte">Plus que la valeur</MenuItem>
							</Select>
						</FormControl>
						<FormControl className="inputField" sx={{ m: 1, width: '25%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-amount">Valeur</InputLabel>
							<OutlinedInput
								id="outlined-adornment-amount"
								name="target"
								type="number"
								onChange={handleChange}
								startAdornment={<InputAdornment position="start">$</InputAdornment>}
								required
								autoComplete='off'
								inputProps={{inputMode: 'numeric', pattern: '[0-9]*', min : minPrice.toString(), max: maxPrice.toString()}}
							/>
						</FormControl>
						<div className='column'>
							{
								(state.parameter !== undefined && state.slug !== undefined) && (
									
									state.parameter === 'lte' 
										?	<div>Veuillez entrer une valeur entre {minPrice} et {maxPrice}$</div>
										: 	<div>Veuillez entrer une valeur minimal {minPrice}$</div>
								)
							}
						</div>
						<div className='row'>
							<input type="submit" value="Ajouter"></input>
							<button type="button" onClick={close} id="cancel-edit">
								Annuler
							</button>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	)
}
