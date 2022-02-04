import React from "react"
import Container from 'react-bootstrap/Container';
import AndSeparator from "./AndSeparator";
import Separator from "./Separator";
import GoogleSignIn from "./GoogleSignIn";
import {login} from '../services/AuthService'

const TITLE = "Connexion"

class LoginForm extends React.Component{


    constructor(props){
        super(props)
        this.state = {username: '', password: ''}

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleGoogle = this.handleGoogle.bind(this)
    }

    handleGoogle(event){
        alert('Forgot Password');
        event.preventDefault();
    }

    handleUsernameChange(event) {
        let username = document.getElementById("userField")
        if(username.validity.typeMismatch){
            username.setCustomValidity("Entrez un nom d'utilisateur")
            username.reportValidity()
        }
        else{
            username.setCustomValidity("")
            this.setState({username: event.target.value});
        }
    }
    handlePasswordChange(event) {
        let password = document.getElementById("passwordField")
        if(password.validity.typeMismatch){
            password.setCustomValidity("Entrez un nom d'utilisateur")
            password.reportValidity()
        }
        else{
            password.setCustomValidity("")
            this.setState({password: event.target.value});
        }
    }

    showError(password, username){
        if(!password.validity.valid){
            password.setCustomValidity("Entrez un mot de passe")
            password.reportValidity()
        }
        if(!username.validity.valid){
            username.setCustomValidity("Entrez un nom d'utilisateur")
            username.reportValidity()
        }
    }
    
    async handleSubmit(event) {
        let password = document.getElementById("passwordField")
        let username = document.getElementById("userField")
        
        if(!password.validity.valid || !username.validity.valid){
            this.showError(password, username)
            event.preventDefault()
        }
        else{
            if(this.state.username == '' || this.state.password == ''){
                this.showError(password, username)
                event.preventDefault()
            }
            else {
                event.preventDefault()
                await login(this.state.username, this.state.password)
            }
        }
    }

    render(){
        return (
            <Container className="p-3" className="form">
                <h1 className="form-title">{TITLE}</h1>
                <div id="wrong">Mauvais courriel ou mot de passe.</div>
                <form onSubmit={this.handleSubmit}>
                    <input id="userField" type="text" placeholder="Courriel" onChange={this.handleUsernameChange} required autoComplete="off"/>
                    <input id="passwordField" type="password" placeholder="Mot de passe" onChange={this.handlePasswordChange} required autoComplete="off"/>
                    <input id="submitButton" type="submit" onClick={this.handleSubmit} value="Connexion" />
                </form>
                <AndSeparator />
                <GoogleSignIn />
                <a className="link" href="/forgotPassword">J'ai oublié mon mot de passe</a>
                <div>
                    <Separator />
                    <div id="Signup">
                        <h4>Vous n'avez pas de compte?</h4> 
                        <a className="link" href="/register"> Inscrivez-vous</a>
                    </div>
                </div>
            </Container>
        )
    }
}

export default LoginForm