import { useState } from 'react'

export const useForm = (initialValues) => {
	const [values, setValues] = useState(initialValues)

	return [
		values,
		(e) => {
			if (!e.target || e.target == undefined) return
			setValues({
				...values,
				[e.target.name]: e.target.value
			})
		},
		() => {
			setValues({})
		}
	]
}
