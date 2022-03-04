import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// import Slider from '@mui/material/Slider'
import MuiInput from '@mui/material/Input'

const Input = styled(MuiInput)`
	width: 42px;
`

const maxValue = 50000

export default function TargetSlider() {
	const [value, setValue] = useState(30)

	// const handleSliderChange = (event, newValue) => {
	// 	setValue(newValue)
	// }

	const handleInputChange = (event) => {
		setValue(event.target.value === '' ? '' : Number(event.target.value))
	}

	const handleBlur = () => {
		if (value < 0) {
			setValue(0)
		} else if (value > maxValue) {
			setValue(maxValue)
		}
	}

	return (
		<Box sx={{ width: 250 }}>
			<Typography id="input-slider" gutterBottom>
				Volume
			</Typography>
			<Grid container spacing={2} alignItems="center">
				<Grid item>
					<Input
						value={value}
						size="medium"
						onChange={handleInputChange}
						onBlur={handleBlur}
						inputProps={{
							step: 100,
							min: 0,
							max: maxValue,
							type: 'number',
							'aria-labelledby': 'input-slider'
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	)
}
