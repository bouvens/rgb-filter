import _ from 'lodash'

const noiseMap = []

const getDeviation = (noise) => (Math.random() * 2 - 1) * noise

export function updateNoiseMap (width, height, noise, noiseSize) {
  if (noise && noiseSize) {
    for (let y = 0; y < height / noiseSize; y += 1) {
      for (let x = 0; x < width / noiseSize; x += 1) {
        _.set(noiseMap, [x, y], {
          rNoise: getDeviation(noise),
          gNoise: getDeviation(noise),
          bNoise: getDeviation(noise),
        })
      }
    }
  }
}

export function noiseFilter ({ color, mapRGB, x, y, options }) {
  const { noise, noiseSize } = options
  let { r, g, b } = color || mapRGB[x][y]

  if (noise) {
    const {
      rNoise,
      gNoise,
      bNoise,
    } = noiseMap[Math.floor(x / noiseSize)][Math.floor(y / noiseSize)]

    r += rNoise
    g += gNoise
    b += bNoise
  }

  return { color: { r, g, b }, mapRGB, x, y, options }
}
