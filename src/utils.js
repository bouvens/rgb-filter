import { IDS } from './constants'

export const PROCESSORS = {
    [IDS.multiplier]: (value) => Math.max(Math.min(value, 16), 1),
    [IDS.limit]: (value) => Math.max(Math.min(value, 1000), 1),
    [IDS.noise]: (value) => Math.max(Math.min(value, 100), 0),
    [IDS.frames]: (value) => Math.max(Math.min(value, 10), 1),
}

export const transparent = (value) => value
