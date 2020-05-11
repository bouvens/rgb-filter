import { IDS } from './constants'
import { getCanvas, getContext } from './singletons'

const SCALED = 'SCALED'

export function getScaledCanvas (canvas, multiplier, imageSmoothingEnabled = false) {
  const scaledCanvas = getCanvas(SCALED)
  scaledCanvas.width = canvas.width * multiplier
  scaledCanvas.height = canvas.height * multiplier

  const scaledContext = getContext(SCALED)
  scaledContext.imageSmoothingEnabled = imageSmoothingEnabled
  scaledContext.msImageSmoothingEnabled = imageSmoothingEnabled
  scaledContext.scale(multiplier, multiplier)
  scaledContext.drawImage(canvas, 0, 0)

  return scaledCanvas
}

export const getImageFromSrc = (src) => new Promise((resolve) => {
  const image = new Image()

  image.onload = ({ target }) => {
    resolve(target)
  }
  image.src = src
})

const makeRange = (min, max) => (value) => Math.round(Math.min(Math.max(value, min), max))

export const PARAMETER_PROCESSORS = {
  [IDS.stripes]: makeRange(0, 150),
  [IDS.stripesStrength]: makeRange(0, 200),
  [IDS.sizeLimit]: makeRange(0, 1000),
  [IDS.noise]: makeRange(0, 255),
  [IDS.noiseSize]: makeRange(0, 10),
  [IDS.frames]: makeRange(0, 10),
}
