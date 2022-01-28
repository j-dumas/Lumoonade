import Head from 'next/head';
import React from 'react';
import Navbar from './Navbar';

const WEBSITE_TITLE = "Révolv'Air"
const WEBSITE_DESCRIPTION = "Révolv'Air"

function Header() {
    return (
        <>  
        <header>
            <Navbar/>
        </header>
        </>
    );
}

export default Header;