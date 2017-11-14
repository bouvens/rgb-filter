import React, { Component } from 'react'
import _ from 'lodash'
import { Connector, Input, SettersBlock } from 'state-control'

const CANVAS_SIZE = 10

const IDS = {
    divider: 'divider',
    multiplier: 'multiplier',
}

const setters = {
    Default: {
        [IDS.divider]: 3,
        [IDS.multiplier]: 3,
    },
    '1-1': {
        [IDS.divider]: 1,
        [IDS.multiplier]: 1,
    },
}

const getColorsFromImage = ({ data, width, height }) => {
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

export default class Experiment extends Component {
    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        ...setters.Default,
    }

    constructor (props) {
        super(props)

        this.state = {
            ...this.props,
            output: '',
            image: null,
        }

        this.file = new FileReader()
        this.file.onload = this.onFileLoad
        this.file.onerror = this.onError

        this.img = new Image()
        this.img.onload = this.onImageLoad
        this.img.onerror = this.onError

        this.offscreenCanvas = document.createElement('canvas')
        this.offscreenContext = this.offscreenCanvas.getContext('2d')

        this.mapRGB = []
    }

    componentDidMount () {
        document.addEventListener('dragover', this.handleDragOver)
        document.addEventListener('drop', this.handleFileSelect)
        this.img.src = './sample.jpg'
    }

    onFileLoad = ({ target }) => {
        this.img.src = target.result
    }

    onImageLoad = ({ target }) => {
        this.setState({ image: target })
    }

    onError = () => {
        this.setState({ output: 'Try another image, please.' })
    }

    canvas
    canvasContext

    drawRGB = () => {
        const { width, height } = this.offscreenCanvas
        const newWidth = width * 3
        const newHeight = height * 3
        this.offscreenCanvas.width = newWidth
        this.offscreenCanvas.height = newHeight
        const imageData = this.offscreenContext.getImageData(0, 0, newWidth, newHeight)
        const { data } = imageData

        for (let y = 0; y < height; y += 1) {
            let newLine = []

            for (let x = 0; x < width; x += 1) {
                const { r, g, b } = this.mapRGB[x][y]
                const red = [r, 0, 0, 255]
                const green = [0, g, 0, 255]
                const blue = [0, 0, b, 255]
                const allTogether = _.concat(red, green, blue)

                newLine = newLine.concat(allTogether)
            }

            data.set(_.concat(newLine, newLine), (y * width * 3) * 4 * 3)
        }

        this.offscreenContext.putImageData(imageData, 0, 0)

        this.canvas.width = newWidth * this.state.multiplier
        this.canvas.height = newHeight * this.state.multiplier
        this.canvasContext.imageSmoothingEnabled = false
        this.canvasContext.scale(this.state.multiplier, this.state.multiplier)
        this.canvasContext.drawImage(this.offscreenCanvas, 0, 0)
    }

    handleFileSelect = (evt) => {
        evt.stopPropagation()
        evt.preventDefault()

        const { files } = evt.dataTransfer

        const output = _.map(files, (f) => (
            <li key={f.name}>
                <strong>{f.name}</strong>{` (${f.type || 'n/a'}) - ${f.size} bytes`}
            </li>
        ))

        this.file.readAsDataURL(files[0])

        this.setState({ output })
    }

    handleDragOver = (evt) => {
        const { dataTransfer } = evt
        dataTransfer.dropEffect = 'copy' // explicitly show this is a copy
        evt.stopPropagation()
        evt.preventDefault()
    }

    changeHandler = (name, value) => {
        this.setState({ [name]: value })
    }

    refCanvas = (elem) => {
        this.canvas = elem
        this.canvasContext = elem.getContext('2d')
        this.canvas.width = CANVAS_SIZE
        this.canvas.height = CANVAS_SIZE
    }

    paint = () => {
        const { image } = this.state
        if (!image) {
            return
        }

        const newWidth = image.width / this.state.divider
        const newHeight = image.height / this.state.divider

        this.offscreenCanvas.width = newWidth
        this.offscreenCanvas.height = newHeight
        this.offscreenContext.drawImage(image, 0, 0, newWidth, newHeight)

        this.mapRGB = getColorsFromImage(this.offscreenContext.getImageData(0, 0, image.width, image.height))
        this.drawRGB()
    }

    render () {
        this.paint()

        return (
            <div>
                <SettersBlock
                    setters={setters}
                    setHandler={this.changeHandler}
                />
                <Connector
                    state={this.state}
                    onChange={this.changeHandler}
                    className="state-control-input"
                    defaultNum={1}
                    type="number"
                >
                    <Input
                        id={IDS.divider}
                        label="Zoom out source"
                    />
                    <Input
                        id={IDS.multiplier}
                        label="Zoom in result"
                    />
                </Connector>
                <hr />
                <div
                    style={{
                        border: '2px dashed #bbb',
                        borderRadius: '15px',
                        padding: '25px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        color: '#bbb',
                        marginBottom: '1.5em',
                    }}
                >
                    Drop file anywhere on page
                </div>
                <div>{this.state.output}</div>
                <canvas
                    ref={this.refCanvas}
                    style={{
                        margin: '1.5em 0',
                        backgroundColor: 'black',
                    }}
                >
                    {'You are using an outdated browser without support of canvas elements.'}
                </canvas>
            </div>
        )
    }
}
