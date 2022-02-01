import React from "react"
import Container from 'react-bootstrap/Container';
import AndSeparator from "./AndSeparator";
import Separator from "./Separator";
// const nodemailer = require("nodemailer")

const TITLE = "Connexion"

class ForgotPasswordForm extends React.Component{

    constructor(props){
        super(props)
        this.state = {email: ''}

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
    } 

    async handleSubmit(event){
        alert(this.state.email)
 
        // //SendEmail
        // let testAccount = await nodemailer.createTestAccount()

        // let transporter = nodemailer.createTransport({
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //       user: testAccount.user, // generated ethereal user
        //       pass: testAccount.pass, // generated ethereal password
        //     },
        //   });

        //   let info = await transporter.sendMail({
        //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
        //     to: "hubert.laliberte@gmail.com", // list of receivers
        //     subject: "Hello ✔", // Subject line
        //     text: "Hello world?", // plain text body
        //     html: "<b>Hello world?</b>", // html body
        //   });
        
        //   console.log("Message sent: %s", info.messageId);
        //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
        //   // Preview only available when sending through an Ethereal account
        //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

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