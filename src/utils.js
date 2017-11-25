import { IDS } from './constants'

export const PROCESSORS = {
    [IDS.multiplier]: (value) => Math.min(Math.max(value, 1), 16),
    [IDS.limit]: (value) => Math.min(Math.max(value, 1), 1000),
    [IDS.noise]: (value) => Math.min(Math.max(value, 0), 100),
    [IDS.frames]: (value) => Math.min(Math.max(value, 1), 10),
}

export const transparent = (value) => value
