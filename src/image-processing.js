import _ from 'lodash'
import GIF from 'gif.js'

let offScreenCanvas
let offScreenContext

function getCanvas () {
    if (!offScreenCanvas) {
        offScreenCanvas = document.createElement('canvas')
    }

    return offScreenCanvas
}

function getContext () {
    if (!offScreenContext) {
        offScreenContext = getCanvas().getContext('2d')
    }

    return offScreenContext
}

const getDeviation = (d) => Math.random() * d

function reduceImage (image, { divider, noise, frames, delay, getBlob }) {
    const width = image.width / divider
    const height = image.height / divider

    getCanvas().width = width
    getCanvas().height = height
    getContext().drawImage(image, 0, 0, width, height)

    if (getCanvas().width < 1 || getCanvas().height < 1) {
        return { data: [], noise }
    }

    return {
        data: getContext().getImageData(0, 0, width, height),
        options: {
            noise: (noise / 100) * 255,
            frames,
            delay,
            getBlob,
        },
    }
}

function mapToRGB ({ data: { data, width, height }, options }) {
    const mapRGB = []

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const index = ((y * width) + x) * 4
            const [r, g, b] = _.slice(data, index, index + 3)

            _.set(mapRGB, [x, y], { r, g, b })
        }
    }

    return { mapRGB, options }
}

function makeItRGB ({ mapRGB, options: { noise, frames, delay, getBlob } }) {
    const width = mapRGB.length
    if (width === 0) {
        return
    }
    const height = mapRGB[0].length
    const newWidth = width * 3
    const newHeight = height * 3

    getCanvas().width = newWidth
    getCanvas().height = newHeight

    const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: './utils/gif.worker.js',
    })

    for (let i = 0; i < frames; i += 1) {
        const imageData = getContext().getImageData(0, 0, newWidth, newHeight)
        const { data } = imageData

        for (let y = 0; y < height; y += 1) {
            let newLine = []

            for (let x = 0; x < width; x += 1) {
                let { r, g, b } = mapRGB[x][y]

                r += getDeviation(noise)
                g += getDeviation(noise)
                b += getDeviation(noise)

                const red = [r, 0, 0, 255]
                const green = [0, g, 0, 255]
                const blue = [0, 0, b, 255]
                const allTogether = _.concat(red, green, blue)

                newLine = newLine.concat(allTogether)
            }

            data.set(_.concat(newLine, newLine, newLine), (y * width * 3) * 4 * 3)
        }

        getContext().putImageData(imageData, 0, 0)

        gif.addFrame(getCanvas(), {
            delay,
            copy: true,
        })
    }

    gif.on('finished', getBlob)

    gif.render()
    console.count('finished')
}

export const toRGB = _.flow([reduceImage, mapToRGB, makeItRGB])
