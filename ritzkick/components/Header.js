import { connection } from 'mongoose';
import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';

function Header() {
    const [mobile, setMobile] = useState(true)
    const [isConnected, setConnection] = useState(false)

    const handleResize = () => {
        if (window.innerWidth >= 1100) setMobile(false)
        else setMobile(true)
    };

    const connection = () => {
        if(sessionStorage.token != undefined) setConnection(true)
        else setConnection(false)
    }

    useEffect(() => {
        handleResize();
        connection();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    

    return (
        <>  
        <header className='row center left'>
            <Navbar mobile={mobile} connected={isConnected}/>
        </header>
        </>
    );
}

export default Header;