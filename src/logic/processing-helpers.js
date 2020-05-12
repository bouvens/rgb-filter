import _ from 'lodash'
import { eightBitFilter, noiseFilter, stripesFilter, updateNoiseMap } from './filters'

export function getDivider ({ image, sizeLimit, splitted, multiplier }) {
  const maxSize = Math.max(image.width, image.height)

  return (maxSize / sizeLimit) * (splitted ? 4 * multiplier : 1)
}

const quadruple = (c) => c.concat(c, c, c)

const allFilters = _.flow([eightBitFilter, noiseFilter, stripesFilter])

function cmyk2rgb (c, m, y, k, normalized) {
  c /= 100
  m /= 100
  y /= 100
  k /= 100

  c = c * (1 - k) + k
  m = m * (1 - k) + k
  y = y * (1 - k) + k

  let r = 1 - c
  let g = 1 - m
  let b = 1 - y

  if (!normalized) {
    r = Math.round(255 * r)
    g = Math.round(255 * g)
    b = Math.round(255 * b)
  }

  return { r, g, b }
}

function rgb2cmyk (r, g, b, normalized) {
  let c = 1 - (r / 255)
  let m = 1 - (g / 255)
  let y = 1 - (b / 255)
  let k = Math.min(c, Math.min(m, y))

  c = (c - k) / (1 - k)
  m = (m - k) / (1 - k)
  y = (y - k) / (1 - k)

  if (!normalized) {
    c = Math.round(c * 10000) / 100
    m = Math.round(m * 10000) / 100
    y = Math.round(y * 10000) / 100
    k = Math.round(k * 10000) / 100
  }

  c = isNaN(c) ? 0 : c
  m = isNaN(m) ? 0 : m
  y = isNaN(y) ? 0 : y
  k = isNaN(k) ? 0 : k

  return { c, m, y, k }
}

export const makeSetFrame = (mapRGB, width, height, options) => ({ data }) => {
  const { rgbSplit, noise, noiseSize } = options
  updateNoiseMap(width, height, noise, noiseSize)

  for (let y = 0; y < height; y += 1) {
    let cyanLine = []
    let magentaLine = []
    let yellowLine = []
    let keyLine = []

    for (let x = 0; x < width; x += 1) {
      const { r, g, b } = allFilters({ mapRGB, x, y, options }).color

      if (rgbSplit) {
        const { c, m, y, k } = rgb2cmyk(r, g, b)

        const { r: rk, g: gk, b: bk } = cmyk2rgb(0, 0, 0, k)
        const key = [rk, gk, bk, 255]

        const { r: rc, g: gc, b: bc } = cmyk2rgb(c, 0, 0, 0)
        const cyan = [rc === 255 ? rk : rc, gc === 255 ? gk : gc, bc === 255 ? bk : bc, 255]

        const { r: rm, g: gm, b: bm } = cmyk2rgb(0, m, 0, 0)
        const magenta = [rm === 255 ? rk : rm, gm === 255 ? gk : gm, bm === 255 ? bk : bm, 255]

        const { r: ry, g: gy, b: by } = cmyk2rgb(0, 0, y, 0)
        const yellow = [ry === 255 ? rk : ry, gy === 255 ? gk : gy, by === 255 ? bk : by, 255]

        cyanLine = cyanLine.concat(quadruple(cyan))
        magentaLine = magentaLine.concat(quadruple(magenta))
        yellowLine = yellowLine.concat(quadruple(yellow))
        keyLine = keyLine.concat(quadruple(key))
      } else {
        data.set([r, g, b, 255], ((y * width) + x) * 4)
      }
    }

    if (rgbSplit) {
      data.set(cyanLine.concat(magentaLine, yellowLine, keyLine), (y * width * 4) * 4 * 4)
    }
  }
}
