export const IDS = {
  rgbSplit: 'rgbSplit',
  eightBit: 'eightBit',
  multiplier: 'multiplier',
  discreteStripes: 'discreteStripes',
  stripeSize: 'stripeSize',
  stripesStrength: 'stripesStrength',
  sizeLimit: 'sizeLimit',
  noise: 'noise',
  noiseSize: 'noiseSize',
  sample: 'sample',
  animate: 'animate',
  frames: 'frames',
  delay: 'delay',
}

const BASE_THROBBER = 'triangles.svg'
const SAMPLE_IMAGES_NAMES = [
  'moon.jpg',
  'sunset.jpg',
  'wikipe-tan.png',
]

const makeFullPath = (name) => `./images/${name}`

export const THROBBER = makeFullPath(BASE_THROBBER)
export const SAMPLE_IMAGE_PATHS = SAMPLE_IMAGES_NAMES.map(makeFullPath)

export const SETTERS = {
  Animated: {
    [IDS.rgbSplit]: false,
    [IDS.eightBit]: true,
    [IDS.multiplier]: 1,
    [IDS.stripeSize]: 2,
    [IDS.stripesStrength]: 10,
    [IDS.discreteStripes]: false,
    [IDS.sizeLimit]: 500,
    [IDS.noise]: 15,
    [IDS.noiseSize]: 3,
    [IDS.frames]: 3,
    [IDS.delay]: 800,
  },
  Still: {
    [IDS.rgbSplit]: false,
    [IDS.eightBit]: true,
    [IDS.stripeSize]: 10,
    [IDS.stripesStrength]: 10,
    [IDS.discreteStripes]: false,
    [IDS.sizeLimit]: 800,
    [IDS.noise]: 5,
    [IDS.noiseSize]: 3,
    [IDS.frames]: 1,
  },
  TrueColor: {
    [IDS.rgbSplit]: false,
    [IDS.eightBit]: false,
    [IDS.multiplier]: 1,
    [IDS.stripeSize]: 4,
    [IDS.stripesStrength]: 5,
    [IDS.discreteStripes]: true,
    [IDS.sizeLimit]: 500,
    [IDS.noise]: 10,
    [IDS.noiseSize]: 4,
    [IDS.frames]: 4,
    [IDS.delay]: 200,
  },
  RGB: {
    [IDS.rgbSplit]: true,
    [IDS.eightBit]: false,
    [IDS.multiplier]: 1,
    [IDS.sizeLimit]: 700,
    [IDS.noise]: 10,
    [IDS.noiseSize]: 1,
    [IDS.frames]: 3,
    [IDS.delay]: 500,
  },
}
