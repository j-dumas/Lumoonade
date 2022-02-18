import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCheckSquare,
	faShoppingCart,
	faChevronDown,
	faChartLine,
	faWallet,
	faGlobe,
	faCoins,
	faUserCircle,
	faMedal,
	faInfoCircle,
	faQuestionCircle,
	faTicketAlt,
	faHandsHelping,
	faBars,
	faTimes,
	faHome,
	faDoorClosed,
	faDoorOpen,
	faStar,
	faFarStar,
	faEdit,
	faArrowDown,
	faArrowUp,
	faExchangeAlt,
	faBell,
	faTrash
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

const Icons = {
	Cart: () => {
		return <FontAwesomeIcon className="icon" icon={faShoppingCart} />
	},
	ChevronDown: () => {
		return <FontAwesomeIcon className="big-icon" icon={faChevronDown} />
	},
	ChartLine: () => {
		return <FontAwesomeIcon className="icon" icon={faChartLine} />
	},
	Wallet: () => {
		return <FontAwesomeIcon className="icon" icon={faWallet} />
	},
	Globe: () => {
		return <FontAwesomeIcon className="icon" icon={faGlobe} />
	},
	Coins: () => {
		return <FontAwesomeIcon className="icon" icon={faCoins} />
	},
	UserCircle: () => {
		return <FontAwesomeIcon className="icon" icon={faUserCircle} />
	},
	Medal: () => {
		return <FontAwesomeIcon className="icon" icon={faMedal} />
	},
	Bars: () => {
		return <FontAwesomeIcon className="icon" icon={faBars} />
	},
	Times: () => {
		return <FontAwesomeIcon className="icon" icon={faTimes} />
	},
	InfoCircle: () => {
		return <FontAwesomeIcon className="icon" icon={faInfoCircle} />
	},
	QuestionCircle: () => {
		return <FontAwesomeIcon className="icon" icon={faQuestionCircle} />
	},
	Ticket: () => {
		return <FontAwesomeIcon className="icon" icon={faTicketAlt} />
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
	Edit: () => {
		return <FontAwesomeIcon className="icon" icon={faEdit} />
	},
	Edit: () => {
		return <FontAwesomeIcon className="icon" icon={faEdit} />
	},
	Edit: () => {
		return <FontAwesomeIcon className="icon" icon={faEdit} />
	},
	ArrowDown: () => {
		return <FontAwesomeIcon className="icon" icon={faArrowDown} />
	},
	ArrowUp: () => {
		return <FontAwesomeIcon className="icon" icon={faArrowUp} />
	},
	Exange: () => {
		return <FontAwesomeIcon className="icon" icon={faExchangeAlt} />
	},
	Bell: () => {
		return <FontAwesomeIcon className="icon" icon={faBell} />
	},
	Trash: () => {
		return <FontAwesomeIcon className="icon" icon={faTrash} />
	}
}

export default Icons
