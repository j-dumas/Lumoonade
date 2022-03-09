import React, { useState } from 'react'
import { deleteWatch } from 'services/UserService'
import { Delete } from '@mui/icons-material'
import format from '../../utils/formatter'

export default function ProfileAlertsComponent(props) {
	function getSign(parameter) {
		if (parameter === 'lte') {
			return <span>&#8804;</span>
		} else if (parameter === 'gte') {
			return <span>&#8805;</span>
		}
	}

	async function handleDelete(event) {
		event.preventDefault()
		await deleteWatch(props.alert._id)
		props.onDataChange()
		props.onDelete()
	}

	return (
		<div>
			<div className="row alert-card">
				<div id="alert-slug" className="alert-card-item">
					{props.alert.slug}
				</div>
				<div className="alert-card-item">
					{props.price}&#36;{' '}
				</div>
				<div className="alert-card-item">{getSign(props.alert.parameter)}</div>
				<div id="alert-target" className="alert-card-item">
					{format(props.alert.target)}&#36;
				</div>
				<button id="delete-alert-button" className="alert-card-item" onClick={(event) => handleDelete(event)}>
					<Delete fontSize="medium" />
				</button>
			</div>
		</div>
	)
}
