import React from "react"
import Container from 'react-bootstrap/Container';
import AndSeparator from "./AndSeparator";
import Separator from "./Separator";
import GoogleSignIn from "./GoogleSignIn";
import axios from 'axios'

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
        this.setState({username: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    
    async handleSubmit(event) {

        // Api call to log user
        //alert('A user was submitted: ' + this.state.username + ' with this password: ' + this.state.password);
        let users = []
        try {
            users = await axios.get('/api/users')
        }
        catch(e){
            console.log(e)
        }
        console.log(users)
        event.preventDefault()
    }

    render(){
        return (
            <Container className="p-3" className="form">
                <h1 className="form-title">{TITLE}</h1>
                <form onSubmit={this.handleSubmit}>
                    <input id="userField" type="text" placeholder="Courriel" onChange={this.handleUsernameChange} required/>
                    <input id="passwordField" type="password" placeholder="Mot de passe" onChange={this.handlePasswordChange} required/>
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