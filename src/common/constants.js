export const IDS = {
  multiplier: 'multiplier',
  limit: 'limit',
  noise: 'noise',
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
    [IDS.multiplier]: 2,
    [IDS.limit]: 400,
    [IDS.noise]: 10,
    [IDS.frames]: 5,
    [IDS.delay]: 200,
  },
  Still: {
    [IDS.multiplier]: 3,
    [IDS.limit]: 800,
    [IDS.noise]: 0,
    [IDS.frames]: 1,
  },
  Slow: {
    [IDS.multiplier]: 2,
    [IDS.limit]: 400,
    [IDS.noise]: 20,
    [IDS.frames]: 2,
    [IDS.delay]: 800,
  },
  Sharp: {
    [IDS.multiplier]: 1,
    [IDS.limit]: 500,
    [IDS.noise]: 10,
    [IDS.frames]: 3,
    [IDS.delay]: 200,
  },
}
