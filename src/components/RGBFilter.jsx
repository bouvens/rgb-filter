import React, { Component } from 'react'
import { Connector, Input } from 'state-control'
import DragAndDrop from './DropImage'
import Canvas from './Canvas'
import { IDS } from './constants'
import { toRGB } from '../image-processing'
import style from './RGBFilter.css'

export default class RGBFilter extends Component {
    static defaultProps = {
        [IDS.multiplier]: 3,
        [IDS.limit]: 900,
    }

    state = {
        ...this.props,
    }

    getDivider = () => {
        const { image, limit, multiplier } = this.state
        const maxSize = Math.max(image.width, image.height)
        const realLimit = limit / multiplier / 3

        return maxSize / realLimit
    }

    handleDrop = (image) => {
        this.setState({ image })
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: value,
        })
    }

    processImage = () => {
        const { image } = this.state
        if (!image) {
            return {}
        }

        return toRGB(image, this.getDivider())
    }

    render () {
        return (
            <div>
                <DragAndDrop
                    onDrop={this.handleDrop}
                    defaultImage="./sample.jpg"
                />
                <Connector
                    state={this.state}
                    onChange={this.handleChange}
                    className={style.controls}
                    type="number"
                >
                    <Input
                        id={IDS.multiplier}
                        label="Zoom in result:"
                    />
                    <Input
                        id={IDS.limit}
                        label="Size:"
                    />
                </Connector>
                <Canvas
                    {...this.processImage()}
                    multiplier={this.state.multiplier}
                    imageSmoothingEnabled={false}
                    className={style.canvas}
                >
                    {'You are using an outdated browser without support of canvas elements.'}
                </Canvas>
            </div>
        )
    }
}
