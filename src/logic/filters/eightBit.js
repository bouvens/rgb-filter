function snapTo (colors, number, totalNumberOfColors = 256) {
  const snap = totalNumberOfColors / colors

  return Math.round(number / snap) * snap
}

export function eightBitFilter ({ color, mapRGB, x, y, options }) {
  const { eightBit } = options
  let { r, g, b } = color || mapRGB[x][y]

  if (eightBit) {
    r = snapTo(8, r)
    g = snapTo(8, g)
    b = snapTo(4, b)
  }

  return { color: { r, g, b }, mapRGB, x, y, options }
}
