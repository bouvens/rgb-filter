const multiply = (modifier, color) => Math.min(
  Math.round(color * (1 + modifier / 100)),
  255,
)

export function stripesFilter ({ color, mapRGB, x, y, options }) {
  const { rgbSplit, discreteStripes, stripes, stripesStrength } = options
  let { r, g, b } = color || mapRGB[x][y]
  const height = mapRGB[0].length

  if (stripes && !rgbSplit) {
    const period = height / stripes / (2 * Math.PI)
    let phase = Math.sin(y / period)
    if (discreteStripes) {
      phase = phase >= 0 ? 1 : -1
    }
    const modifier = phase * stripesStrength

    r = multiply(modifier, r)
    g = multiply(modifier, g)
    b = multiply(modifier, b)
  }

  return { color: { r, g, b }, mapRGB, x, y, options }
}
