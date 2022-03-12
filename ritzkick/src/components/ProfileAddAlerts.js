import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal'
import Icons from '@/components/Icons'
import { addWatch } from 'services/UserService'
import {
	Alert,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Snackbar
} from '@mui/material'
import { useForm } from './hooks/useForm'
import { CloseRounded } from '@mui/icons-material'
import Functions from 'services/CryptoService'
import { SlugToSymbol } from 'utils/crypto'
import { createSocket } from 'services/SocketService'

import { useTranslation } from 'next-i18next'

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
	const { t } = useTranslation('alert')

	const [state, handleChange, resetState] = useForm(props.provenance ? { slug: props.slug } : {})
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
	const [socket, setSocket] = useState()

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
		return parsedData.sort()
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
		}
		const values = await Functions.GetAllCryptocurrencySlugs(1, 1000)
		setData(values.assets)
	}, [])

	useEffect(() => {
		if (state.slug !== undefined) {
			let symbol = []
			if (props.provenance) {
				symbol.push(state.slug)
			} else {
				symbol.push(SlugToSymbol(state.slug, props.currency))
			}
			setSocket(createSocket(['general'], symbol, `wss://${window.location.host}`))
		}
	}, [state])

	useEffect(() => {
		if (state.slug !== undefined && state.parameter !== undefined) {
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
		if (!isOpen && !props.provenance) {
			resetState()
		}
	}, [isOpen])

	useEffect(() => {
		if (!socket) return
		socket.on('data', (slugs) => {
			setPrice(slugs[0].regularMarketPrice)
		})
		if (socket) return () => socket.disconnect()
	}, [socket])

	async function handleSubmit(event) {
		event.preventDefault()
		if (!props.provenance) {
			await addWatch(SlugToSymbol(state.slug, props.currency), state.parameter, state.target)
			props.onDataChange()
		} else {
			await addWatch(state.slug, state.parameter, state.target)
		}
		close()
		setOpen(true)
	}

	return (
		<div className="row center">
			{props.provenance ? (
				<a onClick={open}>
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
					{t('added')}
				</Alert>
			</Snackbar>
			<Modal>
				<div className="edit-popup">
					<h1>{t('title')}</h1>
					<p>{t('description')}</p>
					<form className="column" onSubmit={(event) => handleSubmit(event)}>
						<FormControl
							sx={{ m: 1, width: '25%', minWidth: '50px' }}
							className="inputField"
							variant="filled"
							disabled={props.provenance}
						>
							<InputLabel>{t('labels.crypto')}</InputLabel>
							<Select
								name="slug"
								defaultValue={props.provenance ? slug : ''}
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
							<InputLabel>{t('labels.symbol')}</InputLabel>
							<Select name="parameter" defaultValue="" onChange={handleChange} required>
								<MenuItem value="lte">{t('labels.less')}</MenuItem>
								<MenuItem value="gte">{t('labels.greater')}</MenuItem>
							</Select>
						</FormControl>
						<FormControl className="inputField" sx={{ m: 1, width: '25%' }} variant="filled">
							<InputLabel htmlFor="outlined-adornment-amount">{t('labels.value')}</InputLabel>
							<OutlinedInput
								id="outlined-adornment-amount"
								name="target"
								type="number"
								onChange={handleChange}
								startAdornment={<InputAdornment position="start">$</InputAdornment>}
								required
								autoComplete="off"
								inputProps={{
									pattern: '[0-9]+([.,][0-9]+)?',
									step: '0.0000000001',
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
											{`${t('validation.between.enter')} ${minPrice} 
										${t('validation.between.and')} ${maxPrice}$`}
										</div>
									) : (
										<div>{`${t('validation.minimum')} ${minPrice}$`}</div>
									))}
							</div>
							<div className="row">
								<input type="submit" value={t('add')}></input>
								<button type="button" onClick={close} id="cancel-edit">
									{t('cancel')}
								</button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	)
}
