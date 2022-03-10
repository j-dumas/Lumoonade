import React from 'react'

import EthLogo from 'img/bubbles/ethereum-eth-logo.svg'
import TetherLogo from 'img/bubbles/tether-usdt-logo.svg'
import BinanceLogo from 'img/bubbles/binance-coin-bnb-logo.svg'
import BtcLogo from 'img/bubbles/bitcoin-btc-logo.svg'
import DogeLogo from 'img/bubbles/dogecoin-doge-logo.svg'
import ShibaLogo from 'img/bubbles/shiba-inu-shib-logo.svg'

// https://cryptologos.cc/

function Bubbles() {
	return (
		<>
			<EthLogo className="bubble x1" alt="" />
			<TetherLogo className="bubble x2" alt="" />
			<BinanceLogo className="bubble x3" alt="" />
			<BtcLogo className="bubble x4" alt="" />
			<EthLogo className="bubble x5" />
			<TetherLogo className="bubble x6" alt="" />
			<DogeLogo className="bubble x7" alt="" />
			<BtcLogo className="bubble x8" alt="" />
			<DogeLogo className="bubble x9" alt="" />
			<ShibaLogo className="bubble x10" alt="" />
		</>
	)
}

export default Bubbles
