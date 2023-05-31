function travelHouses({ position, direction, observer = () => { } }) {
	for (let i = 0; 1 == 1; i++) {
		const realX = position.x + (i * direction.x)
		const realY = position.y + (i * direction.y)

		const responseObserver = observer({ position: { x: realX, y: realY } })

		if (responseObserver.stop) { break }
	}
}