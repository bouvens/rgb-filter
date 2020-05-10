import { IDS } from './constants'

export const getImageFromSrc = (src) => new Promise((resolve) => {
  const image = new Image()

  image.onload = ({ target }) => {
    resolve(target)
  }
  image.src = src
})

export function getDivider ({ image, sizeLimit, multiplier }) {
  const maxSize = Math.max(image.width, image.height)
  const realLimit = sizeLimit / multiplier

  return maxSize / realLimit
}

export const PARAMETER_PROCESSORS = {
  [IDS.multiplier]: (value) => Math.min(Math.max(value, 0), 16),
  [IDS.sizeLimit]: (value) => Math.min(Math.max(value, 0), 1000),
  [IDS.noise]: (value) => Math.min(Math.max(value, 0), 100),
  [IDS.frames]: (value) => Math.min(Math.max(value, 0), 10),
}

export const getDeviation = (noise) => Math.random() * (noise / 100) * 255
