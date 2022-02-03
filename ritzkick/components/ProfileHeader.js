import { getURL } from "next/dist/shared/lib/utils"
import React, { useEffect, useState } from "react"

export async function getUsers(){
    //todo: Get user with sessionStorage token
    //Get first user
    try{
        let response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let json = await response.json()
        return json
    }
    catch(e){
        console.log(e)
    }
}

export default function ProfileHeader(){
    const [users, setUsers] = useState(getUsers())

    async () => {
        const data = await getUsers()
        setUsers(data)
        console.log
    }

    useEffect( async () => {
        
        //console.log(users)
        //console.log(data)
        return
    }, [])

    return (
        <div className="profile-header">
            <img id="profile-picture" src="/ETH.svg"></img>
            <ul>
                { users[0].username/* {users.map((username) => (
                    <li>
                        {username}
                    </li>
                ))} */}
            </ul>
            <hr id="profile-separator"></hr>
        </div>
    )
}
