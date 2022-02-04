import React, {useState, useEffect} from 'react';
import { useRouter } from "next/router";
import Icons from './Icons';
//import { Link } from 'react-router-dom';

function Navbar(props) {
    const router = useRouter();
    
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const [isScrolled, setIsScrolled] = useState(false);

    async function logout(event) {
        event.preventDefault()
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.token
                },
            })
            
            sessionStorage.clear()
            window.location.href = '/'
        }
        catch(e){
            console.log(e)
        }

    }

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
   
    return (
        <>
        
        <nav className='navbar' id='nav'>
            {props.mobile ? (
                <>
                    <div className='lil-nav'>
                        <div className='menu-icon' onClick={handleClick}>
                            {click ? <Icons.Times/> : <Icons.Bars/>}
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
            <div className={props.mobile ? (click ? 'active navbar-container-mobile': 'hidden') :'navbar-container'}>
                    <ul className={props.mobile ? 'nav-menu-mobile' : 'nav-menu' }>
                        <li className={router.pathname == '/' ? 'nav-item active-link' : 'nav-item'}>
                            <Icons.Home/>
                            <a href="/" className='nav-links' onClick={closeMobileMenu}>Home</a>
                        </li>
                        <li className={router.pathname == '/assets' ? 'nav-item active-link' : 'nav-item'}>
                            <Icons.Coins/>
                            <a href="/assets" className='nav-links' onClick={closeMobileMenu}>Assets</a>
                        </li>
                        <li className={router.pathname == '/podium' ? 'nav-item active-link' : 'nav-item'}>
                            <Icons.ChartLine/>
                            <a href="/compare" className='nav-links' onClick={closeMobileMenu}>Compare</a>
                        </li>
                        <li className={router.pathname == '/help' ? 'nav-item active-link' : 'nav-item'}>
                            <Icons.InfoCircle/>
                            <a href="/help" className='nav-links'  onClick={closeMobileMenu}>Help Center</a>
                        </li>
                    </ul>
                    <ul className={props.mobile ? 'nav-menu-mobile' : 'nav-menu' }>
                        { props.connected ? (
                            <>
                                <li className={router.pathname == '/wallet' ? 'nav-item active-link' : 'nav-item'}>
                                    <Icons.Wallet/>
                                    <a href="/wallet" className='nav-links'  onClick={closeMobileMenu}>Wallet</a>
                                </li>
                                <li className={router.pathname == '/profile' ? 'nav-item active-link' : 'nav-item'}>
                                    <Icons.UserCircle/>
                                    <a href="/profile" className='nav-links'  onClick={closeMobileMenu}>Profile</a>
                                </li>
                                <li className={router.pathname == '/logout' ? 'nav-item active-link' : 'nav-item'}>
                                    <Icons.DoorOpen/>
                                    { <a className='nav-links'  onClick={closeMobileMenu, logout}>Log out</a>}
                                </li>
                            </>
                        ): (
                            <>
                                <li className={router.pathname == '/login' ? 'nav-item active-link' : 'nav-item'}>
                                    <div className='nav-icons'><Icons.DoorClosed/></div>
                                    <a href="/login" className='nav-links'  onClick={closeMobileMenu}>Log in</a>
                                </li>
                                <li className={router.pathname == '/register' ? 'nav-item active-link' : 'nav-item'}>
                                    <a href="/register" className='nav-links button'  onClick={closeMobileMenu}>Register</a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
        </nav>
        </>
    )
}

export default Navbar