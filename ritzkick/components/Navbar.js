import React, {useState, useEffect} from 'react';
//import { Link } from 'react-router-dom';

function Navbar() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
   
/* <Link to='' className='navbar-logo'>Revolv'Air</Link> */
    return (
        <>  
        <nav className='navbar' id='nav'>
            <div className='navbar-container'>
                <div className={isScrolled ? 'lil-nav scrolled' : 'lil-nav'}>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                    </div>
                    <p>aa</p>
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <a href="#home" className='nav-links' onClick={closeMobileMenu}>HOME</a>
                    </li>
                    <li className='nav-item'>
                        <a href="#about" className='nav-links' onClick={closeMobileMenu}>ABOUT</a>
                    </li>
                    <li className='nav-item'>
                        <a href="#projects" className='nav-links' onClick={closeMobileMenu}>PROJECTS</a>
                    </li>
                    <li className='nav-item'>
                        <a href="#contact" className='nav-links'  onClick={closeMobileMenu}>CONTACT</a>
                    </li>
                </ul>
            </div>
        </nav>
        </>
    )
}

export default Navbar