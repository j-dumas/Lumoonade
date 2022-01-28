import React, {useState, useEffect} from 'react';
import Icons from './Icons';

function BottomArrow() {
    const scrollDown = () => {
        /*document.getElementById('about').scrollIntoView({
            behavior: 'smooth'
        });*/
    }

    useEffect(() => {
        
        //return () => //window.removeEventListener('scroll', onScroll);
    }, []);
   
    return (
        <>
        <div className='bottom-arrow row center'>
            <div onClick={scrollDown()} className='chevron-down'>
                <Icons.ChevronDown/>
            </div>
        </div>
        </>
    )
}

export default BottomArrow