import _ from 'lodash'
import GIF from 'gif.js'
import { getCanvas, getContext } from './singletons'
import { getDeviation, multiply, snapTo } from './utils'

const SCALED = 'SCALED'

function reduceImage ({ image, divider, ...options }) {
  const canvas = getCanvas()
  const context = getContext()
  const width = image.width / divider
  const height = image.height / divider

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)

  if (getCanvas().width < 1 || getCanvas().height < 1) {
    return { error: 'Check parameters and image' }
  }

  return {
    data: context.getImageData(0, 0, width, height),
    options,
  }
}

function mapToRGB ({ data: { data, width, height } = {}, options, error }) {
  const mapRGB = []

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const index = ((y * width) + x) * 4
      const [r, g, b] = data.slice(index, index + 3)

      _.set(mapRGB, [x, y], { r, g, b })
    }
  }

  return { mapRGB, options, error }
}

const makeSetFrame = (mapRGB, width, height, { noise, eightBit, stripes, stripesStrength }) => ({ data }) => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let { r, g, b } = mapRGB[x][y]

      if (noise) {
        r += getDeviation(noise)
        g += getDeviation(noise)
        b += getDeviation(noise)
      }

      if (eightBit) {
        r = snapTo(8, r)
        g = snapTo(8, g)
        b = snapTo(4, b)
      }

      if (stripes) {
        const period = height / stripes / (2 * Math.PI)
        const modifier = Math.sin(y / period) * stripesStrength

        r = multiply(modifier, r)
        g = multiply(modifier, g)
        b = multiply(modifier, b)
      }

      data.set([r, g, b, 255], ((y * width) + x) * 4)
    }
  }
}

const filterImageLikeAnOldTV = ({
  mapRGB,
  options = {},
  error,
}) => new Promise((resolve, reject) => {
  const { frames, multiplier, delay, imageSmoothingEnabled = false } = options

  if (error) {
    reject(new Error(error))
  }
  const width = mapRGB.length
  const canvas = getCanvas()
  const context = getContext()
  if (width === 0) {
    return
  }
  const height = mapRGB[0].length

  const setFrame = makeSetFrame(mapRGB, width, height, options)

  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: './utils/gif.worker.js',
  })

  for (let i = 0; i < frames; i += 1) {
    const imageData = context.getImageData(0, 0, width, height)

    setFrame(imageData)

    context.putImageData(imageData, 0, 0)

    const scaledCanvas = getCanvas(SCALED)

    scaledCanvas.width = canvas.width * multiplier
    scaledCanvas.height = canvas.height * multiplier

    const scaledContext = getContext(SCALED)

    scaledContext.imageSmoothingEnabled = imageSmoothingEnabled
    scaledContext.msImageSmoothingEnabled = imageSmoothingEnabled

    scaledContext.scale(multiplier, multiplier)
    scaledContext.drawImage(canvas, 0, 0)

    gif.addFrame(scaledCanvas, {
      delay,
      copy: true,
    })
  }

  gif.on('finished', (blob) => {
    resolve(window.URL.createObjectURL(blob))
  })

  gif.render()
})

export const toRGB = _.flow([reduceImage, mapToRGB, filterImageLikeAnOldTV])
