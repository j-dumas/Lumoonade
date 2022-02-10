import React from 'react';

class GoogleSignIn extends React.Component {
	handleGoogle(event) {
		alert('Google');
		event.preventDefault();
	}

	render() {
		return (
			<div id="googleSignin">
				<input
					type="image"
					src="https://img.icons8.com/color/48/000000/google-logo.png"
					onClick={this.handleGoogle}
				></input>
				<h4>Se connecter avec Google</h4>
			</div>
		);
	}
}

export default GoogleSignIn;
