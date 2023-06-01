async function Delay(amount) {
	return new Promise(resolve => setTimeout(resolve, amount))
}