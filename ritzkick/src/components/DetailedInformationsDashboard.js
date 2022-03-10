import React, { useEffect, useState } from 'react'
import DetailedInformations from '@/components/DetailedInformations'

const parser = require('app/socket/utils/parser')

const DetailedInformationsDashboard = (props) => {
	const [data, setData] = useState([])
	useEffect(async () => {
		props.socket.on('data', (a) => {
			let b = a.filter((x) => {
				return props.socket.auth.query.find((cc) => cc.toLowerCase() === x.symbol.toLowerCase())
			})
			b = parser.rebuild(b)
			setData(b === undefined ? undefined : b)
		})
		if (props.socket) return () => props.socket.disconnect()
	}, [])

	// Validation:
	if (!props.currency) return <div>Impossible action.</div>

	return !data ? (
		<h1>Wait...</h1>
	) : (
		<div className="row start w-100">
			{data.map((element) => {
				return <DetailedInformations data={element} name={props.name} key={element.fromCurrency} />
			})}
		</div>
	)
}
export default DetailedInformationsDashboard
