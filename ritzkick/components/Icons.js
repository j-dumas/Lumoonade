import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faCheckSquare, faShoppingCart, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const Icons = {
    Cart: () => { return(<FontAwesomeIcon className='icon' icon={faShoppingCart}/>) },
    ChevronDown: () => { return(<FontAwesomeIcon className='big-icon' icon={faChevronDown}/>) }
}

export default Icons;