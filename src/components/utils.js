export const getColorsFromImage = ({ data, width, height }) => {
    const mapRGB = []

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const index = ((y * width) + x) * 4
            const [r, g, b] = data.slice(index, index + 3)

            _.set(mapRGB, [x, y], { r, g, b })
        }
    }

    return mapRGB
}
