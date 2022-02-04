import { getURL } from "next/dist/shared/lib/utils"
import React, { useEffect, useState } from "react"

export async function getUsers(){
    //todo: Get user with token
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

// export default function ProfileHeader(){
//     //const [users, setUsers] = useState(getUsers())
//     var data = undefined
    
//     useEffect( async () => {
//         data = await getUsers()
//         console.log(data)
//         return
//     }, [])

//     return (
//         <div className="profile-header">
//             <img id="profile-picture" src="/ETH.svg"></img>
//             <ul>
//                 {console.log(data)}
//             </ul>
//             <hr id="profile-separator"></hr>
//         </div>
//     )
// }

class ProfileHeader extends React.Component{
    constructor(props){
        super(props)

        this.state = { users: []}
        this.show = this.show.bind(this)
    }

    async componentDidMount() {
        const data = await getUsers()
        this.setState({ users: data})
        console.log(this.state.users)
    }

    show(){
        console.log("in")
        if(this.state.users.length != 0){
            console.log(this.state.users)
            return (
                <div>{this.state.users[0].username}</div>
            )
        }
        else{
            console.log(this.state.users)
            return (
                <div>No name</div>
            )
        }
    }

    render(){
        return (
            <div className="profile-header">
                <img id="profile-picture" src="/ETH.svg"></img>
                {this.show}
                <hr id="profile-separator"></hr>
            </div>
        )
    }
}

export default ProfileHeader
