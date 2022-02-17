export default function format(x) {
	if (x < 1 && x >= 0) return Number.parseFloat(x).toFixed(3)
	return Number.parseFloat(x).toFixed(2)
}
