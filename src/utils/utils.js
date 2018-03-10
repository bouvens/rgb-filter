import { IDS } from '../constants'

export const getSrc = (name) => `./images/${name}`

export const PROCESSORS = {
    [IDS.multiplier]: (value) => Math.min(Math.max(value, 1), 16),
    [IDS.limit]: (value) => Math.min(Math.max(value, 1), 1000),
    [IDS.noise]: (value) => Math.min(Math.max(value, 0), 100),
    [IDS.frames]: (value) => Math.min(Math.max(value, 1), 10),
}
