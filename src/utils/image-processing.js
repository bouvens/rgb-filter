import _ from 'lodash'
import GIF from 'gif.js'
import { getCanvas, getContext, getDeviation, triple } from './utils'

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
    return {}
  }

  return {
    data: context.getImageData(0, 0, width, height),
    options,
  }
}

function mapToRGB ({ data: { data, width, height }, options }) {
  const mapRGB = []

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const index = ((y * width) + x) * 4
      const [r, g, b] = data.slice(index, index + 3)

      _.set(mapRGB, [x, y], { r, g, b })
    }
  }

  return { mapRGB, options }
}

const makeSetFrame = (mapRGB, width, height, noise) => ({ data }) => {
  for (let y = 0; y < height; y += 1) {
    let redLine = []
    let greenLine = []
    let blueLine = []

    for (let x = 0; x < width; x += 1) {
      let { r, g, b } = mapRGB[x][y]

      r += getDeviation(noise)
      g += getDeviation(noise)
      b += getDeviation(noise)

      const red = [r, 0, 0, 255]
      const green = [0, g, 0, 255]
      const blue = [0, 0, b, 255]

      redLine = redLine.concat(triple(red))
      greenLine = greenLine.concat(triple(green))
      blueLine = blueLine.concat(triple(blue))
    }

    data.set(redLine.concat(greenLine, blueLine), (y * width * 3) * 4 * 3)
  }
}

const filterImageLikeAnOldTV = ({
  mapRGB,
  options: {
    noise,
    frames,
    multiplier,
    imageSmoothingEnabled = false,
    delay,
  },
}) => new Promise((resolve) => {
  const width = mapRGB.length
  const canvas = getCanvas()
  const context = getContext()
  if (width === 0) {
    return
  }
  const height = mapRGB[0].length
  const nextWidth = width * 3
  const nextHeight = height * 3

  canvas.width = nextWidth
  canvas.height = nextHeight

  const setFrame = makeSetFrame(mapRGB, width, height, noise)

  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: './utils/gif.worker.js',
  })

  for (let i = 0; i < frames; i += 1) {
    const imageData = context.getImageData(0, 0, nextWidth, nextHeight)

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
