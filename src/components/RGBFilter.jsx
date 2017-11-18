import React, { Component } from 'react'
import { Connector, Input } from 'state-control'
import DragAndDrop from './DropImage'
import Canvas from './Canvas'
import { IDS } from './constants'
import { toRGB } from '../image-processing'
import style from './RGBFilter.css'

const IMAGES = [
    'moon.jpg',
    'sunset.jpg',
    'wikipe-tan.png',
]

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
        [IDS.sample]: IMAGES[0],
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

    getSrc = (name) => `./images/${name}`

    handleDrop = (image) => {
        this.setState({ image })
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: Math.round((PROCESSORS[name] || transparent)(value)),
        })
    }

    selectImage = (sample) => () => {
        this.setState({ sample })
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
                    defaultImage={this.getSrc(this.state.sample)}
                />
                <div className={style.controls}>
                    <Connector
                        state={this.state}
                        onChange={this.handleChange}
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
                </div>
                <div className={style.samples}>
                    <p>Or select one of samples:</p>
                    {_.map(IMAGES, (image) => (
                        <img
                            key={image}
                            src={this.getSrc(image)}
                            onClick={this.selectImage(image)}
                            alt=""
                        />
                    ))}
                </div>
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
