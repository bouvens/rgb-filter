import _ from 'lodash'
import { eightBitFilter, noiseFilter, stripesFilter, updateNoiseMap } from './filters'

export function getDivider ({ image, sizeLimit, splitted, multiplier }) {
  const maxSize = Math.max(image.width, image.height)

  return (maxSize / sizeLimit) * (splitted ? 3 * multiplier : 1)
}

const triple = (c) => c.concat(c, c)

const allFilters = _.flow([noiseFilter, eightBitFilter, stripesFilter])

export const makeSetFrame = (mapRGB, width, height, options) => ({ data }) => {
  const { rgbSplit, noise, noiseSize } = options
  updateNoiseMap(width, height, noise, noiseSize)

  for (let y = 0; y < height; y += 1) {
    let redLine = []
    let greenLine = []
    let blueLine = []

    for (let x = 0; x < width; x += 1) {
      const { r, g, b } = allFilters({ mapRGB, x, y, options }).color

      if (rgbSplit) {
        const red = [r, 0, 0, 255]
        const green = [0, g, 0, 255]
        const blue = [0, 0, b, 255]

        redLine = redLine.concat(triple(red))
        greenLine = greenLine.concat(triple(green))
        blueLine = blueLine.concat(triple(blue))
      } else {
        data.set([r, g, b, 255], ((y * width) + x) * 4)
      }
    }

    if (rgbSplit) {
      data.set(redLine.concat(greenLine, blueLine), (y * width * 3) * 4 * 3)
    }
  }
}
