import React from "react"
import Container from 'react-bootstrap/Container';
import AndSeparator from "./AndSeparator";
import Separator from "./Separator";
import Script from "next/script";
// const nodemailer = require("nodemailer")

const TITLE = "Connexion"
const SENDEMAIL = "https://formsubmit.co/"

class ForgotPasswordForm extends React.Component{

    constructor(props){
        super(props)
        this.state = {email: ''}
        this.emailQuery = SENDEMAIL + this.state.email

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
    } 

    async handleSubmit(event){
        // alert(this.state.email)

        Email.send({
            Host : "smtp.gmail.com",
            Username : "rubiscrash0@gmail.com",
            Password : "WeKlypi3",
            To : 'hubert.laliberte@gmail.com',
            From : "rubiscrash0@gmail.com",
            Subject : "test",
            Body : "test"
        }).then(
          message => alert(message)
        );

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
                <Script src="https://smtpjs.com/v3/smtp.js" /> 
                <h1 className="form-title">Problème de connexion?</h1>
                <h4>Entrez votre adresse courriel et nous vous enverrons un lien pour récupérer votre compte.</h4>
                <form  method="POST">
                    <input name="email" id="emailField" type="email" placeholder="Courriel" onChange={this.handleEmailChange} required></input>
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