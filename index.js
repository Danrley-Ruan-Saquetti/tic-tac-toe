function App() {
    const gameController = GameController()
    const renderController = RenderController()

    document.querySelectorAll(".table .house").forEach(_house => {
        const x = _house.getAttribute("data-position-x") || ""
        const y = _house.getAttribute("data-position-y") || ""

        if (!x || !y) { return }

        _house.addEventListener("click", () => {
            if (!game.running) {return}

            gameController.lance(x, y)
            renderController.newLance(_house, x, y)
        })
    })

    document.querySelector('[name="bt-new-game"]').addEventListener("click", () => {
        gameController.newGame()
        renderController.resetGame()
    })

    gameController.subscribeObserver({code: "$game/new-game", observerFunction: ({data}) => {
        renderController.resetGame(data.side)
    }})
    gameController.subscribeObserver({code: "$game/new-lance", observerFunction: ({data}) => {
        renderController.newLance(data.position.x, data.position.y, data.currentSide, data.oldSide)
    }})
    gameController.subscribeObserver({code: "$game/end-game", observerFunction: ({data}) => {
        renderController.gameEnd(data.winner, data.lineProps)
    }})

    gameController.newGame()
    renderController.initComponents()
}

window.onload = App