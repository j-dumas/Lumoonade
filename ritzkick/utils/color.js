/**
 * Get the color for a specific slug
 * @param {string} slug slug of the asset
 * @returns the appropriate color for the asset
 */
export default function GetColorBySlug(slug) {
	slug = slug.toString().split('-')[0].toUpperCase()
	switch (slug) {
		case 'ADA':
			return 'rgb(0, 50, 100)'
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
			return 'white'
	}
}