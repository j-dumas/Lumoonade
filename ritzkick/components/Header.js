import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';

function Header() {
    const [mobile, setMobile] = useState(true);

    const handleResize = () => {
        if (window.innerWidth >= 1100) setMobile(false)
        else setMobile(true)
    };
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    

    return (
        <>  
        <header className='row center left'>
            <Navbar mobile={mobile} connected={false}/>
        </header>
        </>
    );
}

export default Header;