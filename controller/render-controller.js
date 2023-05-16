function RenderController() {
    const players = {
        o: document.querySelector('.player-info[data-player-side="o"]'),
        x: document.querySelector('.player-info[data-player-side="x"]'),
    }

    const gameContent = document.querySelector(".table-content")
    const table = document.querySelector(".table")

    const ICON_CLASS = {
        x: "x-lg",
        o: "circle"
    }

    const initComponents = () => {
        toggleSide()
    }

    const resetGame = (side) => {
        document.querySelectorAll(".table .house").forEach(_house => _house.innerHTML = "")

        players["o"].classList.toggle("winner", false)
        players["x"].classList.toggle("winner", false)
        players["o"].classList.toggle("draw", false)
        players["x"].classList.toggle("draw", false)

        gameContent.classList.toggle("enable", true)
        gameContent.classList.toggle("disable", false)

        table.querySelector(".line-winner")?.remove()

        toggleSide(side)
    }

    const gameEnd = (side, lineProps) => {
        gameContent.classList.toggle("enable", false)
        gameContent.classList.toggle("disable", true)

        if (side == "-") {
            players["o"].classList.add("draw")
            players["x"].classList.add("draw")

            return
        }

        // const lineEl = document.createElement("div")

        // lineEl.classList.add("line-winner")

        // lineEl.setAttribute("data-direction-type", lineProps.type)
        // lineEl.setAttribute("data-line", lineProps.direction)

        players[side].classList.add("winner")

        // table.appendChild(lineEl)
    }

    const newLance = (x, y, currentSide, oldSide) => {
        const house = document.querySelector(`.house[data-position-x="${x}"][data-position-y="${y}"]`)

        if (!house) { return }

        house.innerHTML = `<i class="icon bi-${ICON_CLASS[oldSide]} ${oldSide}"></i>`

        toggleSide(currentSide)
    }

    const toggleSide = (side = "") => {
        players.o.classList.toggle("this-side", side == "o")
        players.x.classList.toggle("this-side", side == "x")
    }

    return {
        newLance,
        initComponents,
        resetGame,
        gameEnd
    }
}