function App() {
    const gameController = GameController()
    const renderController = RenderController()
    const aiControl = AiControl()

    let aiIsLance = false
    const AI_ENABLE = true

    const setupMap = () => {
        const lances = [
            { x: 1, y: 1 },
            { x: 0, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 2 },
            { x: 2, y: 2 },
        ]

        lances.forEach(({ x, y }) => {
            const _house = document.querySelector(`.table .house[data-position-x="${x}"][data-position-y="${y}"]`)

            if (!_house) { return }

            playerLance(x, y, _house, true)
        })
    }

    const aiLance = async () => {
        if (!game.running) { return }

        if (!AI_ENABLE) { return }

        aiIsLance = true

        const resAI = await aiControl.newLance(gameController.game.map)

        console.log(resAI)

        aiIsLance = false
    }

    const playerLance = (x, y, _house, force = false) => {
        if (!game.running) { return }

        if (!force && aiIsLance) { return }

        gameController.lance(x, y)
        renderController.newLance(_house, x, y)
    }

    document.querySelectorAll(".table .house").forEach(_house => {
        const x = _house.getAttribute("data-position-x") || ""
        const y = _house.getAttribute("data-position-y") || ""

        if (!x || !y) { return }

        _house.addEventListener("click", () => {
            if (!game.running) { return }

            playerLance(x, y, _house)
        })
    })

    document.querySelector('[name="bt-new-game"]').addEventListener("click", () => {
        gameController.newGame()
        renderController.resetGame()
    })

    gameController.subscribeObserver({
        code: "$game/new-game", observerFunction: ({ data }) => {
            renderController.resetGame(data.side)
        }
    })
    gameController.subscribeObserver({
        code: "$game/new-lance", observerFunction: ({ data }) => {
            renderController.newLance(data.position.x, data.position.y, data.currentSide, data.oldSide)
            console.log(data.player)
            aiLance()
        }
    })
    gameController.subscribeObserver({
        code: "$game/end-game", observerFunction: ({ data }) => {
            renderController.gameEnd(data.winner)
        }
    })

    gameController.newGame()
    renderController.initComponents(gameController.game.players.map(pl => pl.username).reverse())
    setupMap()
}

window.onload = App