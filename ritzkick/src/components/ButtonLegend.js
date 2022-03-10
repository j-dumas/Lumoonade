import React, { useState } from 'react'

function ButtonLegend(props) {
	const [selected, setSelected] = useState(props.value)
	const handleSelected = () => {
		setSelected(!selected)
		props.sendData(selected)
	}

	return (
		<>
			<div className="">
				<button
					onClick={handleSelected}
					className="detailed-chart-legend-button"
					style={
						selected
							? { backgroundColor: props.backgroundColor, color: 'var(--font-color)' }
							: { backgroundColor: 'var(--background-color-3)' }
					}
				>
					{props.name}
				</button>
			</div>
		</>
	)
}

export default ButtonLegend
