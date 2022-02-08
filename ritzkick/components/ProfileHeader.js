import React, { useEffect, useState } from "react"
import ProfilePopup from "./ProfilePopup";
import { getCookie } from "../services/CookieService"

export async function removeSession() {
    try{
        let response = await fetch('/api/me/sessions/purge', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie("token")
            },
        })
        
        let json = await response.json()
        console.log(json)
    }
    catch(e){
        console.log(e)
    }
}

export async function getUser(){
    //todo: Get user with token
    //Get first user
    try{
        let response = await fetch('/api/me/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie("token")
            },
        })

        let json = await response.json()
        return json
    }
    catch(e){
        console.log(e)
    }
}

const usernameTitleId = "username"
const memberSinceId = "memberSince"


class ProfileHeader extends React.Component{
    constructor(props){
        super(props)

        this.state = { user: {}}
        this.parseTime = this.parseTime.bind(this)
        this.getMonth = this.getMonth.bind(this)
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
            <div className="row">
                <div className="profile-header" id="header">
                    <ProfilePopup  username={this.state.user.username} email={this.state.user.email}/>
                    <img id="profile-picture" src="/ETH.svg"></img>
                    <div className="row">
                        <div className="profile-card">
                            <h1 id={usernameTitleId}></h1>
                            <h3 id={memberSinceId}></h3>
                        </div>
                        <div className="profile-card">
                            <h1>You currectly have {this.state.user.sessions}</h1>    
                            <button onClick={removeSession}>Clear sessions</button>                        
                        </div>
                    </div>
                    <hr id="profile-separator"></hr>
                </div>
            </div>
        )
    }
}

export default ProfileHeader
