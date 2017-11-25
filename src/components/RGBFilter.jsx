import React, { Component } from 'react'
import { Connector, Input } from 'state-control'
import _ from 'lodash'
import DragAndDrop from './DropImage'
import { IDS, IMAGES } from '../constants'
import { PROCESSORS, transparent } from '../utils'
import { toRGB } from '../image-processing'
import style from './RGBFilter.css'

let cache

export default class RGBFilter extends Component {
    static defaultProps = {
        [IDS.multiplier]: 2,
        [IDS.limit]: 800,
        [IDS.noise]: 10,
        [IDS.sample]: IMAGES[0],
        [IDS.frames]: 5,
        [IDS.delay]: 200,
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

    setImage = (blob) => {
        this.image.src = window.URL.createObjectURL(blob)
    }

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
        const { image = {}, noise, frames, delay, multiplier } = this.state
        const newCache = { image: image.src, noise, frames, delay, multiplier }

        if (!image.src || _.isEqual(cache, newCache)) {
            return
        }

        cache = newCache

        toRGB(image, {
            divider: this.getDivider(),
            noise: this.state.noise,
            frames: this.state.frames,
            delay: this.state.delay,
            getBlob: this.setImage,
            multiplier: this.state.multiplier,
        })
    }

    render () {
        this.processImage()

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
                        <Input
                            id={IDS.frames}
                            label="Frames:"
                            step={1}
                        />
                        <Input
                            id={IDS.delay}
                            label="Delay:"
                            step={50}
                        />
                    </Connector>
                    <button onClick={this.processImage}>Render</button>
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
                <div className={style.animation}>
                    <img
                        ref={(e) => { this.image = e }}
                        alt=""
                    />
                </div>
            </div>
        )
    }
}
