import React, { Component } from 'react'
import _ from 'lodash'
import { Connector, Input, SettersBlock } from 'state-control'
import DragAndDrop from './DropImage'
import Canvas from './Canvas'
import { IDS, SETTERS } from './constants'
import { getColorsFromImage } from './utils'
import style from './RGBFilter.css'

export default class RGBFilter extends Component {
    static defaultProps = {
        ...SETTERS.Default,
    }

    constructor (props) {
        super(props)

        this.state = { ...this.props }

        this.offscreenCanvas = document.createElement('canvas')
        this.offscreenContext = this.offscreenCanvas.getContext('2d')
    }

    changeHandler = (name, value) => {
        this.setState({ [name]: value })
    }

    handleDrop = (image) => {
        this.setState({ image })
    }

    processImage = () => {
        const { image } = this.state
        if (!image) {
            return
        }

        let newWidth = image.width / this.state.divider
        let newHeight = image.height / this.state.divider

        this.offscreenCanvas.width = newWidth
        this.offscreenCanvas.height = newHeight
        this.offscreenContext.drawImage(image, 0, 0, newWidth, newHeight)

        const mapRGB = getColorsFromImage(this.offscreenContext.getImageData(0, 0, newWidth, newHeight))

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
                const { r, g, b } = mapRGB[x][y]
                const red = [r, 0, 0, 255]
                const green = [0, g, 0, 255]
                const blue = [0, 0, b, 255]
                const allTogether = _.concat(red, green, blue)

                newLine = newLine.concat(allTogether)
            }

            data.set(_.concat(newLine, newLine), (y * width * 3) * 4 * 3)
        }

        this.offscreenContext.putImageData(imageData, 0, 0)

        this.width = newWidth
        this.height = newHeight
        this.imageSmoothingEnabled = false
        this.multiplier = this.state.multiplier
        this.image = this.offscreenCanvas
    }

    render () {
        this.processImage()

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
                <DragAndDrop
                    onDrop={this.handleDrop}
                    defaultImage="./sample.jpg"
                />
                <Canvas
                    width={this.width}
                    height={this.height}
                    imageSmoothingEnabled={this.imageSmoothingEnabled}
                    multiplier={this.multiplier}
                    image={this.image}
                    className={style.canvas}
                >
                    {'You are using an outdated browser without support of canvas elements.'}
                </Canvas>
            </div>
        )
    }
}
