const DEFAULT_ID = 'DEFAULT_ID'

const offScreenCanvas = []
export function getCanvas (id = DEFAULT_ID) {
  if (!offScreenCanvas[id]) {
    offScreenCanvas[id] = document.createElement('canvas')
  }
  return offScreenCanvas[id]
}

const offScreenContext = []
export function getContext (id = DEFAULT_ID) {
  if (!offScreenContext[id]) {
    offScreenContext[id] = getCanvas(id).getContext('2d')
  }
  return offScreenContext[id]
}
