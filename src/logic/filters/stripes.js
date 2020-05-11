const multiply = (modifier, color) => Math.min(
  Math.round(color * (1 + modifier / 100)),
  255,
)

export function stripesFilter ({ color, mapRGB, x, y, options }) {
  const { rgbSplit, discreteStripes, stripeSize, stripesStrength } = options
  let { r, g, b } = color || mapRGB[x][y]

  if (stripeSize && !rgbSplit) {
    const period = stripeSize / Math.PI
    let phase = Math.sin((y + 1) / period)
    if (discreteStripes) {
      phase = phase > 0 ? 1 : -1
    }
    const modifier = phase * stripesStrength

    r = multiply(modifier, r)
    g = multiply(modifier, g)
    b = multiply(modifier, b)
  }

  return { color: { r, g, b }, mapRGB, x, y, options }
}
