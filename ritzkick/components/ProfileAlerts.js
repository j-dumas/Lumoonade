import React, { useEffect, useState } from "react"
import { getWatchList } from "../services/UserService"
import ProfileAddAlerts from "./ProfileAddAlerts"
import ProfileAlertsComponent from "./ProfileAlertsComponent"



export default function ProfileAlerts(){
    let [data, setData] = useState([])
    
    
    useEffect(() => {
        getWatchList()
        .then(res => {
            setData(res)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div id="alerts">
            <div id="alerts-header" className="row">
                <h1>Alerts</h1>
                <ProfileAddAlerts />
            </div>
            <ul>
                {data.map(alert => (
                    <li key={alert._id}><ProfileAlertsComponent  alert={alert}/></li>
                ))}
            </ul>
        </div>
    )
}