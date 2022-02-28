import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal'
import Icons from '@/components/Icons'
import { addWatch } from 'services/UserService'
import {
	Alert,
	Snackbar,
	FormControl,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Select,
	MenuItem
} from '@mui/material'

const data = [
	{
		slug: 'btc',
		name: 'Bitcoin'
	},
	{
		slug: 'eth',
		name: 'Etherium'
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
	const [state, setState] = useState({ slug: data[0].slug, target: 0, parameter: 'lte' })
	const [Modal, open, close, isOpen] = useModal('alerts-header', {
		preventScroll: true,
		closeOnOverlayClick: true
	})
	const [openStatus, setOpen] = useState(false)

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	useEffect(() => {
		if (!isOpen) {
			//Reset chaque fois que le popup est fermé
			setState({ slug: data[0].slug, target: 0, parameter: 'lte' })
		}
	}, [isOpen])

	function handleTargetChange(event) {
		setState({ ...state, target: event.target.value })
	}

	function handleSymbolChange(event) {
		setState({ ...state, parameter: event.target.value })
	}

	function handleSlugChange(event) {
		setState({ ...state, slug: event.target.value })
	}

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
							<Select defaultValue={data[0].slug} onChange={handleSlugChange}>
								{parseData().map((crypt) => (
									<MenuItem key={crypt.value} value={crypt.value}>
										{crypt.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ m: 1, width: '30%' }} className="inputField" variant="filled">
							<InputLabel>Symbole</InputLabel>
							<Select defaultValue="lte" onChange={handleSymbolChange}>
								<MenuItem value="lte">Moins que la valeur</MenuItem>
								<MenuItem value="gte">Plus que la valeur</MenuItem>
							</Select>
						</FormControl>
						<FormControl className="inputField" sx={{ m: 1, width: '25%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-amount">Valeur</InputLabel>
							<OutlinedInput
								id="outlined-adornment-amount"
								onChange={handleTargetChange}
								startAdornment={<InputAdornment position="start">$</InputAdornment>}
								required
								autoComplete="off"
								inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: '15000' }}
							/>
						</FormControl>
						<input type="submit" value="Ajouter"></input>
						<button type="button" onClick={close} id="cancel-edit">
							Annuler
						</button>
					</form>
				</div>
			</Modal>
		</div>
	)
}
