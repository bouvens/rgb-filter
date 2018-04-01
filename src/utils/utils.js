import { IDS } from '../constants'

export const getImageFromSrc = (src) => new Promise((resolve) => {
    const image = new Image()

    image.onload = ({ target }) => {
        resolve(target)
    }
    image.src = src
})

export function getDivider ({ image, limit, multiplier }) {
    const maxSize = Math.max(image.width, image.height)
    const realLimit = limit / multiplier / 3

    return maxSize / realLimit
}

export const PROCESSORS = {
    [IDS.multiplier]: (value) => Math.min(Math.max(value, 1), 16),
    [IDS.limit]: (value) => Math.min(Math.max(value, 1), 1000),
    [IDS.noise]: (value) => Math.min(Math.max(value, 0), 100),
    [IDS.frames]: (value) => Math.min(Math.max(value, 1), 10),
}

export const getDeviation = (noise) => Math.random() * (noise / 100) * 255

export const triple = (c) => c.concat(c, c)

// singletons for canvas and context

const offScreenCanvas = []
const offScreenContext = []
const DEFAULT_ID = 'DEFAULT_ID'

export function getCanvas (id = DEFAULT_ID) {
    if (!offScreenCanvas[id]) {
        offScreenCanvas[id] = document.createElement('canvas')
    }

    return offScreenCanvas[id]
}

export function getContext (id = DEFAULT_ID) {
    if (!offScreenContext[id]) {
        offScreenContext[id] = getCanvas(id).getContext('2d')
    }

    return offScreenContext[id]
}
