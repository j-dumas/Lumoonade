import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal'
import Icons from './Icons'
import { addWatch } from '../../services/UserService'
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
import { useForm } from './hooks/useForm'
import { CloseRounded } from '@mui/icons-material'
import Functions from 'services/CryptoService'

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
	const [data, setData] = useState(undefined)
	const [slug, setSlug] = useState(undefined)

	function getPrice(symbol) {
		data.forEach((element) => {
			if (element.symbol === symbol) {
				console.log(element.symbol)
				setPrice(5000)
			}
		})
	}

	function parseData() {
		let parsedData = []
		if (data !== undefined) {
			data.forEach((element) => {
				let tempValue = {
					label: element.name,
					value: element.symbol
				}
				parsedData.push(tempValue)
			})
		}
		return parsedData
	}

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	useEffect(async () => {
		if (props.provenance) {
			let tempValue = props.slug.split('-')
			setSlug(tempValue[0])
			// const tempSlug = {target: {name: "slug", value: tempValue[0]}}
			// handleChange(tempSlug)
		}
		const values = await Functions.GetAllCryptocurrencySlugs(1, 1000)
		setData(values.assets)
	}, [])

	useEffect(() => {
		if (state.slug !== undefined) {
			getPrice(state.slug)
		}
		if (state.parameter !== undefined) {
			if (state.parameter === 'lte') {
				setMinPrice(0)
				setMaxPrice(price)
			} else {
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
		const tempSlug = { target: { name: 'slug', value: slug } }
		handleChange(tempSlug)

		await addWatch(state)
		if (!props.provenance) {
			props.onDataChange()
		}
		close()
		setOpen(true)
	}

	return (
		<div className="row center">
			{props.provenance ? (
				<a href="" onClick={open}>
					<Icons.Bell />
				</a>
			) : (
				<button className="icon-button" id="rotate-button" onClick={open}>
					<CloseRounded fontSize="medium" />
				</button>
			)}
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
						<FormControl
							sx={{ m: 1, width: '25%', minWidth: '50px' }}
							className="inputField"
							variant="filled"
							disabled={props.provenance}
						>
							<InputLabel>Crypto</InputLabel>
							<Select
								name="slug"
								defaultValue={props.provenance ? slug : ''}
								value={slug}
								onChange={handleChange}
								MenuProps={MenuProps}
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
							<Select name="parameter" defaultValue="" onChange={handleChange} required>
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
								autoComplete="off"
								inputProps={{
									inputMode: 'numeric',
									pattern: '[0-9]*',
									min: minPrice.toString(),
									max: maxPrice.toString()
								}}
							/>
						</FormControl>
						<div>
							<div className="column">
								{state.parameter !== undefined &&
									state.slug !== undefined &&
									(state.parameter === 'lte' ? (
										<div>
											Veuillez entrer une valeur entre {minPrice} et {maxPrice}$
										</div>
									) : (
										<div>Veuillez entrer une valeur minimal {minPrice}$</div>
									))}
							</div>
							<div className="row">
								<input type="submit" value="Ajouter"></input>
								<button type="button" onClick={close} id="cancel-edit">
									Annuler
								</button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	)
}
