import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import { useForm } from './hooks/useForm'
import {InputLabel, OutlinedInput, FormControl, IconButton, InputAdornment, styled, FormHelperText} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function ResetPasswordForm() {
    const router = useRouter()
    const { key } = router.query

    const [state, handleChange] = useForm([])
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
    const [error, setError] = useState(false)


    function handleSubmit(event){
        event.preventDefault()
        if(state.password === state.passwordConfirmation){
            //Api call
            alert(state.password + " " + state.passwordConfirmation + " " + key)
        }
        else{
            setError(true)
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
      };
    const handleClickShowPasswordConfirmation = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation)
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };


  return (
    <Container className="p-3 form">
        <h1 className="form-title">Problème de connexion?</h1>
			<form method="POST" onSubmit={(event) => handleSubmit(event)}>
                <FormControl className='inputField' sx={{ m: 1, width: '100%' }} error={error} variant="filled">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        name='password'
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        fullWidth
                        required
                        inputProps={{minLength: 8}}
                    />
                </FormControl>
                {
                    !!error && (
                        <FormHelperText error id="error-input" sx={{textAlign: "center"}}>
                            Les mots de passe ne sont pas identiques
                        </FormHelperText>
                    )
                }
                <FormControl className="inputField" sx={{ m: 1, width: '100%' }} error={error} variant="filled">
                    <InputLabel htmlFor="outlined-adornment-password-confirmation">Password Confirmation</InputLabel>
                        <OutlinedInput
                            name='passwordConfirmation'
                            id="outlined-adornment-password-confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPasswordConfirmation}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                        {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            required
                            inputProps={{minLength: 8}}
                        />
                </FormControl>
                <input type="submit" value="Modifier"></input>
			</form>
    </Container>
  )
}
