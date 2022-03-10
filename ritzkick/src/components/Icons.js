import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowDown,
	faArrowUp,
	faBars,
	faBell,
	faChartLine,
	faChevronDown,
	faCoins,
	faDoorClosed,
	faDoorOpen,
	faList,
	faSearch,
	faWallet,
	faUserCircle,
	faTimes,
	faHome,
	faStar
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

const Icons = {
	ChevronDown: () => {
		return <FontAwesomeIcon className="big-icon" icon={faChevronDown} />
	},
	ChartLine: () => {
		return <FontAwesomeIcon className="icon" icon={faChartLine} />
	},
	Wallet: () => {
		return <FontAwesomeIcon className="icon" icon={faWallet} />
	},
	Coins: () => {
		return <FontAwesomeIcon className="icon" icon={faCoins} />
	},
	UserCircle: () => {
		return <FontAwesomeIcon className="icon" icon={faUserCircle} />
	},
	Bars: () => {
		return <FontAwesomeIcon className="icon" icon={faBars} />
	},
	Times: () => {
		return <FontAwesomeIcon className="icon" icon={faTimes} />
	},
	Home: () => {
		return <FontAwesomeIcon className="icon" icon={faHome} />
	},
	DoorClosed: () => {
		return <FontAwesomeIcon className="icon" icon={faDoorClosed} />
	},
	DoorOpen: () => {
		return <FontAwesomeIcon className="icon" icon={faDoorOpen} />
	},
	StarEmpty: () => {
		return <FontAwesomeIcon className="icon" icon={farStar} />
	},
	StarFulled: () => {
		return <FontAwesomeIcon className="icon" icon={faStar} />
	},
	ArrowDown: () => {
		return <FontAwesomeIcon className="icon" icon={faArrowDown} />
	},
	ArrowUp: () => {
		return <FontAwesomeIcon className="icon" icon={faArrowUp} />
	},
	Bell: () => {
		return <FontAwesomeIcon className="icon" icon={faBell} />
	},
	List: () => {
		return <FontAwesomeIcon className="icon" icon={faList} />
	},
	Search: () => {
		return <FontAwesomeIcon className="icon" icon={faSearch} />
	}
}

export default Icons
