import React, { Component } from 'react'
import { Connector, Input } from 'state-control'
import DragAndDrop from './DropImage'
import Canvas from './Canvas'
import { IDS } from './constants'
import { toRGB } from '../image-processing'
import style from './RGBFilter.css'

export default class RGBFilter extends Component {
    static defaultProps = {
        [IDS.divider]: 1,
        [IDS.multiplier]: 3,
        [IDS.limit]: 900,
    }

    state = {
        ...this.props,
    }

    getDivider = ({
        image = this.state.image,
        limit = this.state.limit,
        multiplier = this.state.multiplier,
    }) => {
        const maxSize = Math.max(image.width, image.height)
        let { divider } = this.state

        const realLimit = limit / multiplier / 3
        if (maxSize > realLimit) {
            divider = Math.ceil(maxSize / realLimit)
        }

        return divider
    }

    handleDrop = (image) => {
        this.setState({ image, divider: this.getDivider({ image }) })
    }

    handleChange = (name, value) => {
        let { divider } = this.state

        if (name === IDS.limit) {
            divider = this.getDivider({ limit: value })
        }

        this.setState({
            divider,
            [name]: value,
        })
    }

    processImage = () => {
        const { image, divider } = this.state
        if (!image) {
            return {}
        }

        return toRGB(image, divider)
    }

    render () {
        return (
            <div>
                <Connector
                    state={this.state}
                    onChange={this.handleChange}
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
                    <Input
                        id={IDS.limit}
                        label="Size limit"
                    />
                </Connector>
                <hr />
                <DragAndDrop
                    onDrop={this.handleDrop}
                    defaultImage="./sample.jpg"
                />
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
