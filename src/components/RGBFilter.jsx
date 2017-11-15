import React, { Component } from 'react'
import _ from 'lodash'
import { Connector, Input, SettersBlock } from 'state-control'
import Canvas from './Canvas'
import { IDS, SETTERS } from './constants'
import { getColorsFromImage } from './utils'
import style from './RGBFilter.css'

export default class RGBFilter extends Component {
    // noinspection JSUnusedGlobalSymbols
    static defaultProps = {
        ...SETTERS.Default,
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
        // document.addEventListener('dragenter', this.handleDragOver)
        // document.addEventListener('dragleave', this.handleDragOver)
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

    paint = () => {
        const { image } = this.state
        if (!image) {
            return {}
        }

        let newWidth = image.width / this.state.divider
        let newHeight = image.height / this.state.divider

        this.offscreenCanvas.width = newWidth
        this.offscreenCanvas.height = newHeight
        this.offscreenContext.drawImage(image, 0, 0, newWidth, newHeight)

        this.mapRGB = getColorsFromImage(this.offscreenContext.getImageData(0, 0, image.width, image.height))

        const { width, height } = this.offscreenCanvas
        newWidth = width * 3
        newHeight = height * 3
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

        return {
            width: newWidth,
            height: newHeight,
            imageSmoothingEnabled: false,
            multiplier: this.state.multiplier,
            image: this.offscreenCanvas,
        }
    }

    render () {
        return (
            <div>
                <SettersBlock
                    setters={SETTERS}
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
                <div className={style.dropZone}>
                    Drop file anywhere on page
                </div>
                <div>{this.state.output}</div>
                <Canvas
                    paint={this.paint}
                    className={style.canvas}
                >
                    {'You are using an outdated browser without support of canvas elements.'}
                </Canvas>
            </div>
        )
    }
}
