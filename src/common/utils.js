import { IDS } from './constants'

export const getImageFromSrc = (src) => new Promise((resolve) => {
  const image = new Image()

  image.onload = ({ target }) => {
    resolve(target)
  }
  image.src = src
})

export function getDivider ({ image, sizeLimit, splitted, multiplier }) {
  const maxSize = Math.max(image.width, image.height)

  return (maxSize / sizeLimit) * (splitted ? 3 * multiplier : 1)
}

const makeRange = (min, max) => (value) => Math.round(Math.min(Math.max(value, min), max))

export const PARAMETER_PROCESSORS = {
  [IDS.stripes]: makeRange(0, 150),
  [IDS.stripesStrength]: makeRange(0, 200),
  [IDS.sizeLimit]: makeRange(0, 1000),
  [IDS.noise]: makeRange(0, 255),
  [IDS.noiseSize]: makeRange(0, 10),
  [IDS.frames]: makeRange(0, 10),
}

export const triple = (c) => c.concat(c, c)

export const getDeviation = (noise) => (Math.random() * 2 - 1) * noise

export function snapTo (colors, number, totalNumberOfColors = 256) {
  const snap = totalNumberOfColors / colors

  return Math.round(number / snap) * snap
}

export const multiply = (modifier, color) => Math.min(
  Math.round(color * (1 + modifier / 100)),
  255,
)
