import _ from 'lodash'
import GIF from 'gif.js'
import { getCanvas, getContext } from './singletons'
import { getDivider, makeSetFrame } from './processing-helpers'
import { getScaledCanvas } from './utils'

function reduceImage ({ image, sizeLimit, ...options }) {
  const divider = getDivider({
    image,
    sizeLimit,
    splitted: options.rgbSplit,
    multiplier: options.multiplier,
  })
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

function makeFrameProcessor ({
  mapRGB,
  options = {},
  error,
}) {
  if (error) {
    return { error }
  }

  const width = mapRGB.length
  if (width === 0) {
    return { error: 'Zero width' }
  }
  const height = mapRGB[0].length

  const setFrame = makeSetFrame(mapRGB, width, height, options)

  return { setFrame, width, height, options }
}

const addFrames = ({
  setFrame,
  width: initWidth,
  height: initHeight,
  options = {}, error,
}) => new Promise((resolve, reject) => {
  if (error) {
    reject(new Error(error))
  }

  const { rgbSplit, frames, delay, multiplier } = options
  const gif = new GIF({ workers: 2, quality: 10, workerScript: './utils/gif.worker.js' })

  const canvas = getCanvas()
  const context = getContext()

  const splitMultiplier = rgbSplit ? 4 : 1
  const width = initWidth * splitMultiplier
  const height = initHeight * splitMultiplier

  canvas.width = width
  canvas.height = height

  for (let i = 0; i < frames; i += 1) {
    const imageData = context.getImageData(0, 0, width, height)

    setFrame(imageData)
    context.putImageData(imageData, 0, 0)
    gif.addFrame(getScaledCanvas(canvas, rgbSplit ? multiplier : 1), { delay, copy: true })
  }

  gif.on('finished', (blob) => {
    resolve(window.URL.createObjectURL(blob))
  })

  gif.render()
})

export const toRGB = _.flow([reduceImage, mapToRGB, makeFrameProcessor, addFrames])
