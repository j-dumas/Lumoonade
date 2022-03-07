export default function GetColorBySlug(slug) {
	slug = slug.toString().split('-')[0].toUpperCase()
	switch (slug) {
		case '1INCH':
			return 'orange'
		case 'AAVE':
			return 'orange'
		case 'ACA':
			return 'orange'
		case 'ACH':
			return 'orange'
		case 'ACM':
			return 'orange'
		case 'ADA':
			return 'rgb(0, 50, 100)'
		case 'ADADOWN':
			return 'orange'
		case 'ADAUP':
			return 'orange'
		case 'ADX':
			return 'orange'
		case 'AERGO':
			return 'orange'
		case 'AGIX':
			return 'orange'
		case 'AGLD':
			return 'orange'
		case 'AION':
			return 'orange'
		case 'AKRO':
			return 'orange'
		case 'ALCX':
			return 'orange'
		case 'ALGO':
			return 'orange'
		case 'ALICE':
			return 'orange'
		case 'ALPACA':
			return 'orange'
		case 'ALPHA':
			return 'orange'
		case 'AMB':
			return 'orange'
		case 'AMP':
			return 'orange'
		case 'ANC':
			return 'orange'
		case 'ANKR':
			return 'orange'
		case 'ANT':
			return 'orange'
		case 'ANY':
			return 'orange'
		case 'API3':
			return 'orange'
		case 'AR':
			return 'orange'
		case 'ARDR':
			return 'orange'
		case 'ARK':
			return 'orange'
		case 'ARPA':
			return 'orange'
		case 'ASR':
			return 'orange'
		case 'AST':
			return 'orange'
		case 'ATA':
			return 'orange'
		case 'ATM':
			return 'orange'
		case 'ATOM':
			return 'orange'
		case 'AUCTION':
			return 'orange'
		case 'AUD':
			return 'orange'
		case 'AUDIO':
			return 'orange'
		case 'AUTO':
			return 'orange'
		case 'AVA':
			return 'orange'
		case 'AVAX':
			return 'orange'
		case 'AXS':
			return 'orange'

		// ****** * ****** //
		// ****** B ****** //
		// ****** * ****** //
		case 'BADGER':
			return 'orange'
		case 'BAKE':
			return 'orange'
		case 'BAL':
			return 'orange'
		case 'BAND':
			return 'orange'
		case 'BAR':
			return 'orange'
		case 'BAT':
			return 'orange'
		case 'BCD':
			return 'orange'
		case 'BCH':
			return 'orange'
		case 'BEAM':
			return 'orange'
		case 'BEL':
			return 'orange'
		case 'BETA':
			return 'orange'
		case 'BETH':
			return 'orange'
		case 'BICO':
			return 'orange'
		case 'ALGO':
			return 'orange'
		case 'ALICE':
			return 'orange'
		case 'ALPACA':
			return 'orange'
		case 'ALPHA':
			return 'orange'
		case 'AMB':
			return 'orange'
		case 'AMP':
			return 'orange'
		case 'ANC':
			return 'orange'
		case 'ANKR':
			return 'orange'
		case 'ANT':
			return 'orange'
		case 'ANY':
			return 'orange'
		case 'API3':
			return 'orange'
		case 'AR':
			return 'orange'
		case 'ARDR':
			return 'orange'
		case 'ARK':
			return 'orange'
		case 'ARPA':
			return 'orange'
		case 'ASR':
			return 'orange'
		case 'AST':
			return 'orange'
		case 'ATA':
			return 'orange'
		case 'ATM':
			return 'orange'
		case 'ATOM':
			return 'orange'
		case 'AUCTION':
			return 'orange'
		case 'AUD':
			return 'orange'
		case 'AUDIO':
			return 'orange'
		case 'AUTO':
			return 'orange'
		case 'AVA':
			return 'orange'
		case 'AVAX':
			return 'orange'
		case 'AXS':
			return 'orange'

		case 'BNB':
			return 'rgb(255,215,0)'
		case 'BTC':
			return 'rgb(255,165,0)'
		case 'ETH':
			return 'rgb(0,206,209)'
		case 'DOGE':
			return 'rgb(222,184,135)'
		case 'LTC':
			return 'rgb(211,211,211)'
		default:
			return 'white'//getComputedStyle(document.documentElement).getPropertyValue('--main-color');
	}
}
