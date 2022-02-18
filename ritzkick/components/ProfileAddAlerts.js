import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal'
import Icons from './Icons'
import { addWatch } from '../services/UserService'
import Select from 'react-select'
import { Alert, Autocomplete, Snackbar, TextField } from '@mui/material'

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
			label: element.slug,
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

	function handleSymbolChange(opt) {
		setState({ ...state, parameter: opt.value })
	}

	function handleSlugChange(opt) {
		setState({ ...state, slug: opt.value })
	}

	async function handleSubmit(event) {
		event.preventDefault()
		await addWatch(state)
		await props.onDataChange()
		close()
		setOpen(true)
	}

	return (
		<div>
			<button className="icon-button transform" id="rotate-button" onClick={open}>
				<Icons.Times />
			</button>
			<Snackbar open={openStatus} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
					Alerte ajoutée !
				</Alert>
			</Snackbar>
			<Modal>
				<div className="edit-popup">
					<h1>Ajouter une alerte</h1>
					<form className="row" onSubmit={(event) => handleSubmit(event)}>
						<Select className="selector" options={parseData()} onChange={(opt) => handleSlugChange(opt)} />
						<input
							type="number"
							placeholder="Valeur"
							onChange={handleTargetChange}
							required
							min="1"
						></input>{' '}
						{/*max="market cap"*/}
						<Select
							className="selector"
							onChange={(opt) => handleSymbolChange(opt)}
							options={[
								{ label: 'Moins que la valeur', value: 'lte' },
								{ label: 'Plus que la valeur', value: 'gte' }
							]}
						/>
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
