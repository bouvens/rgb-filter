import React, { Component } from 'react'
import { Connector, Input } from 'state-control'
import DragAndDrop from './DropImage'
import Canvas from './Canvas'
import { IDS } from './constants'
import { toRGB } from '../image-processing'
import style from './RGBFilter.css'

const PROCESSORS = {
    [IDS.multiplier]: (value) => Math.max(Math.min(value, 16), 1),
    [IDS.limit]: (value) => Math.max(Math.min(value, 1000), 1),
    [IDS.noise]: (value) => Math.max(Math.min(value, 100), 0),
}

const transparent = (value) => value

export default class RGBFilter extends Component {
    static defaultProps = {
        [IDS.multiplier]: 2,
        [IDS.limit]: 800,
        [IDS.noise]: 10,
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
            [name]: Math.round((PROCESSORS[name] || transparent)(value)),
        })
    }

    processImage = () => {
        const { image } = this.state
        if (!image) {
            return {}
        }

        return toRGB(image, {
            divider: this.getDivider(),
            noise: this.state.noise,
        })
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
                        step={100}
                    />
                    <Input
                        id={IDS.noise}
                        label="Color noise:"
                        step={5}
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
