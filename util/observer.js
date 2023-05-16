function useObserver() {
    const observers = []

    const subscribeObserver = ({observerFunction, code}) => {
        observers.push({observerFunction, code})
    }

    const notifyObservers = ({data, code = null}) => {
        if (code) {
            observers.filter(obs => {return obs.code == code}).forEach(obs => {
                setTimeout(() => {
                    obs.observerFunction({ data })
                }, 1)
            })
        } else {
            observers.forEach(obs => {
                setTimeout(() => {
                    obs.observerFunction({ data })
                }, 1)
            })
        }
    }

    return {
        subscribeObserver,
        notifyObservers
    }
}