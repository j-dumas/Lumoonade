import React, { useEffect, useState } from "react"
import ProfilePopup from "./ProfilePopup";
import { removeSession, getUser } from "../services/UserService";

const usernameTitleId = "username"
const memberSinceId = "memberSince"


class ProfileHeader extends React.Component{
    constructor(props){
        super(props)

        this.state = { user: {}}
        this.parseTime = this.parseTime.bind(this)
        this.getMonth = this.getMonth.bind(this)
        this.removeUserSession = this.removeUserSession.bind(this)
    }

    async removeUserSession(event){
        await removeSession()
        const data = await getUser()
        this.setState({ user: data})
    }

    getMonth(monthNumber){
        const month = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Decembre"];

        return month[monthNumber - 1];
    }

    parseTime(createdAt) {
        let dateSliced = createdAt.split('-')
        let year = dateSliced[0]
        let month = dateSliced[1]
        let day = dateSliced[2].substring(0,2)

        return "Membre depuis le " + parseInt(day) + " " + this.getMonth(parseInt(month)) + " " + year
    }

    async componentDidMount() {
        const data = await getUser()
        this.setState({ user: data})
        console.log(this.state.user)
        document.getElementById(usernameTitleId).innerText = this.state.user.username
        document.getElementById(memberSinceId).innerText = this.parseTime(this.state.user.createdAt)
    }

    render(){
        return (
            <div>
                <div className="profile-header" id="header">
                    <div className="row">
                        <div className="column profile-card">
                            <ProfilePopup  username={this.state.user.username} email={this.state.user.email}/>
                            <div className="row h-center">
                                <img id="profile-picture" src="/ETH.svg"></img>
                                <h1 id={usernameTitleId}></h1>
                            </div>
                            <div className="row information">
                                <div>
                                    <h3 id={memberSinceId}></h3>
                                </div>
                            </div>
                        </div>
                        <div className="profile-card center">
                            <h2>Vous avez présentement {this.state.user.sessions} sessions actives</h2>    
                            <button id="purge-session" onClick={(event) => {this.removeUserSession(event)}}>Effacer les sessions inutiles</button>                        
                        </div>
                    </div>
                    <div className="column">
                        <hr id="profile-separator"></hr>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileHeader
