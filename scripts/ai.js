function AiControl() {
    const STATE = {
        side: "",
        delay: 0,
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

    const setup = ({ delay, side } = { side: "", delay }) => {
        STATE.delay = delay
        STATE.side = side
    }

    // Util
    const getLanceAttack = (map) => {
        let lancePosition = { x: -1, y: -1 }

        for (let i = 0; i < directions.length; i++) {
            const _direction = directions[i]
            let cont = 0

            let contSidePeaces = 0

            travelHouses({
                ..._direction,
                observer: ({ position }) => {
                    if (cont >= CONT_LOOP) { return { stop: true } }
                    cont++

                    if (typeof map[position.x][position.y] == "undefined") { return { stop: true } }

                    if (map[position.x][position.y] && map[position.x][position.y] != STATE.side) { return { stop: true } }

                    if (map[position.x][position.y]) { contSidePeaces++ } else {
                        lancePosition = position
                    }

                    return {}
                }
            })

            if (contSidePeaces == 2) {
                return { lance: lancePosition, ok: true }
            }
        }

        return { lance: lancePosition, ok: false }
    }

    const getLanceDefense = (map) => {
        let lancePosition = { x: -1, y: -1 }

        for (let i = 0; i < directions.length; i++) {
            const _direction = directions[i]
            let cont = 0

            let contSidePeaces = 0

            travelHouses({
                ..._direction,
                observer: ({ position }) => {
                    if (cont >= CONT_LOOP) { return { stop: true } }
                    cont++

                    if (typeof map[position.x][position.y] == "undefined") { return { stop: true } }

                    if (map[position.x][position.y] && map[position.x][position.y] == STATE.side) { return { stop: true } }

                    if (map[position.x][position.y]) { contSidePeaces++ } else {
                        lancePosition = position
                    }

                    return {}
                }
            })

            if (contSidePeaces == 2) {
                return { lance: lancePosition, ok: true }
            }
        }

        return { lance: lancePosition, ok: false }
    }

    const getLanceRandom = (map) => {
        let lancePosition = { x: -1, y: -1 }

        do {
            lancePosition = {
                x: randomNumber(0, map.length - 1),
                y: randomNumber(0, map[0].length - 1),
            }
        } while (map[lancePosition.x][lancePosition.y] || typeof map[lancePosition.x][lancePosition.y] == "undefined")

        return { lance: lancePosition, ok: true }
    }

    // Use Case
    const newLance = async(map) => {
        await Delay(STATE.delay)

        const resAttack = isCanAttack(map)

        if (resAttack.ok) { return {...resAttack.lance, type: "attack" } }

        const resDefense = isNeedDefense(map)

        if (resDefense.ok) { return {...resDefense.lance, type: "defense" } }

        return {...isNeedRandom(map).lance, type: "random" }
    }

    const isCanAttack = (map) => {
        return getLanceAttack(map)
    }

    const isNeedDefense = (map) => {
        return getLanceDefense(map)
    }

    const isNeedRandom = (map) => {
        return getLanceRandom(map)
    }

    return {
        newLance,
        setup
    }
}