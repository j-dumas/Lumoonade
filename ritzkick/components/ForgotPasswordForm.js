import React from "react"
import Container from 'react-bootstrap/Container';
import AndSeparator from "./AndSeparator";
import Separator from "./Separator";

const TITLE = "Connexion"

class ForgotPasswordForm extends React.Component{

    constructor(props){
        super(props)
        this.state = {email: ''}

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
    } 

    handleSubmit(event){
        alert(this.state.email)
        event.preventDefault()
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

    render(){
        return (
            <Container className="p-3" className="form">
                <h1 className="form-title">Problème de connexion?</h1>
                <h4>Entrez votre adresse courriel et nous vous enverrons un lien pour récupérer votre compte.</h4>
                <form>
                    <input id="emailField" type="email" placeholder="Courriel" onChange={this.handleEmailChange} required></input>
                    <input type="submit" value="Envoyez" onClick={this.handleSubmit}></input>
                </form>
                <AndSeparator/>
                <a className="link" href="/register">Créer un compte</a>
                <Separator />
                <a className="link" href="/login">Revenir à l'écran de connexion</a>
            </Container>
        );
    }
}

export default ForgotPasswordForm