import React from "react"
import Container from 'react-bootstrap/Container';
import Google from './/GoogleSignIn'
import AndSeparator from "./AndSeparator";
import Separator from "./Separator";

const TITLE = "Inscription"

class RegisterForm extends React.Component{

    constructor(props){
        super(props)
        this.state = {username: '', password: '', email: ''}

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleEmailChange(event) {
        let email = document.getElementById("emailField")
        if(email.validity.typeMismatch){
            email.setCustomValidity("Entrez une adresse courriel valide.")
            email.reportValidity()
        }
        else {
            email.setCustomValidity("")
            this.setState({email: event.target.value});
        }
    }
    handleUsernameChange(event) {
        let username = document.getElementById("usernameField")
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
            password.setCustomValidity("Entrez un mot de passe contenant 8 carachtères")
            password.reportValidity()
        }
        else{
            password.setCustomValidity("")
            this.setState({password: event.target.value});
        }
    }

    //https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
    showError(password, username, email){
        if(!username.validity.valid){
            username.setCustomValidity("Entrez un nom d'utilisateur")
            username.reportValidity()
        }
        if(!email.validity.valid){
            if(email.validity.typeMismatch || email.validity.valueMissing){
                email.setCustomValidity("Entrez une adresse courriel valide.")
                email.reportValidity()
            }
        }
        if(!password.validity.valid){
            password.setCustomValidity("Entrez un mot de passe contenant 8 charactères")
            password.reportValidity()
        }
    }

    handleSubmit(event) {
        let password = document.getElementById("passwordField")
        let username = document.getElementById("usernameField")
        let email = document.getElementById("emailField")

        if(!password.validity.valid || !username.validity.valid || !email.validity.valid){
            this.showError(password, username, email)
            event.preventDefault()
        }
        else{
            if(this.state.username == '' || this.state.password == '' || this.state.email == ''){
                this.showError(password, username, email)
                event.preventDefault()
            }else{
                // Api call to log user
                alert('A user was submitted: ' + this.state.username + ' with this password: ' + this.state.password + ' and email: ' + this.state.email);
                event.preventDefault();
            }
        }
    }



    render(){
        return (
            <Container className="p-3" className="form">
                <h1 className="form-title">{TITLE}</h1>
                <Google />
                <AndSeparator />
                <form onSubmit={this.handleSubmit} id="registerForm">
                    <input id="usernameField" type="text" placeholder="Nom d'utilisateur" onChange={this.handleUsernameChange} required/>
                    <input id="emailField" type="email" placeholder="Courriel" onChange={this.handleEmailChange} required/>
                    <input id="passwordField" type="password" placeholder="Mot de passe" onChange={this.handlePasswordChange} required minLength="8"/>
                    <input id="submitButton" type="submit" onClick={this.handleSubmit} value="S'inscrire" />
                    <div>
                        <Separator />
                        <div id="Signup">
                            <h4>Vous avez un compte?</h4> 
                            <a className="link" href="/login">Connectez-vous</a>
                        </div>
                    </div>
                </form>
            </Container>
        )
    }
}

export default RegisterForm