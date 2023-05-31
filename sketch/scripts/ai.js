function AiControl() {
	const SIDE = "o"

	const CONFIG = {
		delay: 1000
	}

	const CONT_LOOP = 3
	const directions = [
		{ position: { x: 0, y: 0 }, direction: { x: 1, y: 0 } },
		{ position: { x: 0, y: 1 }, direction: { x: 1, y: 0 } },
		{ position: { x: 0, y: 2 }, direction: { x: 1, y: 0 } },
		{ position: { x: 0, y: 0 }, direction: { x: 0, y: 1 } },
		{ position: { x: 1, y: 0 }, direction: { x: 0, y: 1 } },
		{ position: { x: 2, y: 0 }, direction: { x: 0, y: 1 } },
		{ position: { x: 0, y: 0 }, direction: { x: 1, y: 1 } },
		{ position: { x: 0, y: 2 }, direction: { x: 1, y: -1 } },
	]

	// Util
	const getLanceAttack = (map) => {
		let lancePosition = { x: 0, y: 0 }

		for (let i = 0; i < directions.length; i++) {
			const _direction = directions[i]
			let cont = 0

			let contSidePeaces = 0

			travelHouses({
				..._direction, observer: ({ position }) => {
					if (cont >= CONT_LOOP) { return { stop: true } }
					cont++

					if (typeof map[position.x][position.y] == "undefined") { return { stop: true } }

					if (map[position.x][position.y] != SIDE) { return { stop: true } }

					contSidePeaces++

					return {}
				}
			})
		}

		return lancePosition
	}

	// Use Case
	const newLance = async (map) => {
		await Delay(CONFIG.delay)

		const resAttack = isCanAttack(map)

		if (resAttack) { return resAttack }

		const resDefense = isNeedDefense(map)

		if (resDefense) { return resDefense }

		const resRandom = isNeedRandom(map)

		if (resRandom) { return resRandom }

		return { x: -1, y: -1 }
	}

	const isCanAttack = (map) => {
		const res = getLanceAttack(map)

		console.log(res)

		return res
	}

	const isNeedDefense = (map) => {

	}

	const isNeedRandom = (map) => {

	}

	return {
		newLance
	}
}