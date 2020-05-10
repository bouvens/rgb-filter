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
  [IDS.multiplier]: (value) => Math.round(Math.min(Math.max(value, 0), 16)),
  [IDS.stripes]: (value) => Math.round(Math.min(Math.max(value, 0), 150)),
  [IDS.stripesStrength]: (value) => Math.round(Math.min(Math.max(value, 0), 200)),
  [IDS.sizeLimit]: (value) => Math.round(Math.min(Math.max(value, 0), 1000)),
  [IDS.noise]: (value) => Math.round(Math.min(Math.max(value, 0), 255)),
  [IDS.frames]: (value) => Math.round(Math.min(Math.max(value, 0), 10)),
}

export const getDeviation = (noise) => (Math.random() * 2 - 1) * noise

export function snapTo (colors, number, totalNumberOfColors = 256) {
  const snap = totalNumberOfColors / colors

  return Math.round(number / snap) * snap
}

export const multiply = (modifier, color) => Math.min(
  Math.round(color * (1 + modifier / 100)),
  255,
)
