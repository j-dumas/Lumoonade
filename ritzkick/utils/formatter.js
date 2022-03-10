export default function format(x, digits = true) {
	if (x === 0) return x
	if (digits) {
		if (x < 1 && x > -1) return Number.parseFloat(x).toFixed(5)
		else x = Number.parseFloat(x).toFixed(2)
	}
	x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return x
}
