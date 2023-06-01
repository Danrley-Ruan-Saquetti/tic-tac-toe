function GameController() {
    const observer = useObserver()

    const newGame = () => {
        game.running = true
        game.side = "x"
        game.map = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
            // ["o", "", "o"],
            // ["", "x", ""],
            // ["x", "", "x"]
        ]
        game.winner = ""
        game.lineProps = {
            position: { x: -1, y: -1 },
            type: "",
            direction: ""
        }
        game.players = [
            { username: "Player", code: "player", side: "x" },
            { username: "CPU", code: "ai", side: "o" }
        ]

        observer.notifyObservers({ code: "$game/new-game", data: { ...game } })
    }

    const gameOver = (winner = "", lineProps = []) => {
        game.winner = winner
        game.lineProps = lineProps
        game.running = false

        observer.notifyObservers({ code: "$game/end-game", data: { winner: game.winner, lineProps: game.lineProps } })
    }

    function isMate() {
        let winner = ""
        let lineProps = []

        const CONT_LOOP = 3

        const directions = [
            { position: { x: 0, y: 0 }, direction: { x: 1, y: 0 }, type: "line", typeDirection: "vertical" },
            { position: { x: 0, y: 1 }, direction: { x: 1, y: 0 }, type: "line", typeDirection: "vertical" },
            { position: { x: 0, y: 2 }, direction: { x: 1, y: 0 }, type: "line", typeDirection: "vertical" },
            { position: { x: 0, y: 0 }, direction: { x: 0, y: 1 }, type: "line", typeDirection: "horizontal" },
            { position: { x: 1, y: 0 }, direction: { x: 0, y: 1 }, type: "line", typeDirection: "horizontal" },
            { position: { x: 2, y: 0 }, direction: { x: 0, y: 1 }, type: "line", typeDirection: "horizontal" },
            { position: { x: 0, y: 0 }, direction: { x: 1, y: 1 }, type: "diagonal", typeDirection: "primary" },
            { position: { x: 0, y: 2 }, direction: { x: 1, y: -1 }, type: "diagonal", typeDirection: "secondary" },
        ]

        for (let i = 0; i < directions.length; i++) {
            const _direction = directions[i]

            let cont = 0
            let isMateValue = true
            let ref = ""
            let _lineProps = {
                position: _direction.position,
                type: _direction.type,
                direction: _direction.typeDirection
            }

            travelHouses({
                ..._direction, observer: ({ position }) => {
                    if (cont >= CONT_LOOP) { return { stop: true } }
                    cont++

                    if (!game.map[position.x][position.y]) {
                        isMateValue = false
                        return { stop: true }
                    }

                    if (!ref) {
                        ref = game.map[position.x][position.y]
                        return {}
                    }

                    if (game.map[position.x][position.y] != ref) {
                        isMateValue = false
                        return { stop: true }
                    }

                    return {}
                }
            })

            if (isMateValue) {
                winner = ref
                lineProps = _lineProps
                break
            }
        }

        if (!winner) {
            if (game.map.every(line => {
                return line.every(house => { return house })
            })) {
                winner = "-"
            }
        }

        return { winner, lineProps }
    }

    function lance(x, y) {
        if (!game.running) { return }

        if (game.map[x][y]) { return }

        const oldSide = game.side

        game.map[x][y] = oldSide

        game.side = oldSide == "x" ? "o" : "x"

        const { winner, lineProps } = isMate()

        if (winner) {
            gameOver(winner, lineProps)
        }

        const player = game.players.find(({ side }) => side == oldSide)

        observer.notifyObservers({ code: "$game/new-lance", data: { position: { x, y }, oldSide, currentSide: game.side, player } })
    }

    return {
        lance,
        game,
        newGame,
        subscribeObserver: observer.subscribeObserver
    }
}