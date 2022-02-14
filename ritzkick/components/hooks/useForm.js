import { useState } from "react"

export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues)

    return [values, e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }, e =>{
        e.forEach(element => {
            setValues({
                ...values,
                [element]: ''
            })
        });
    }]
}