import React, { Component } from 'react'
import { Connector, Input, SettersBlock } from 'state-control'
import _ from 'lodash'
import DragAndDrop from './DropImage'
import { IDS, IMAGES, SETTERS } from '../constants'
import { PROCESSORS, transparent } from '../utils'
import { toRGB } from '../image-processing'
import style from './RGBFilter.css'

let cache

const getSrc = (name) => `./images/${name}`
const throbber = getSrc('triangles.svg')

export default class RGBFilter extends Component {
    static defaultProps = {
        ...SETTERS.Animated,
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
        const { image, noise, frames, delay, multiplier } = this.state
        if (!image) {
            return
        }

        const newCache = { image: image.src, divider: this.getDivider(), noise, frames, delay, multiplier }

        if (_.isEqual(cache, newCache)) {
            return
        }

        this.image.src = throbber
        cache = newCache

        toRGB(image, {
            divider: this.getDivider(),
            noise: this.state.noise,
            frames: this.state.frames,
            delay: this.state.delay,
            multiplier: this.state.multiplier,
            getBlob: this.setImage,
        })
    }

    render () {
        this.processImage()

        return (
            <div>
                <DragAndDrop
                    onDrop={this.handleDrop}
                    defaultImage={getSrc(this.state.sample)}
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
                </div>
                <div className={style.samples}>
                    <p>Or select one of samples:</p>
                    {_.map(IMAGES, (image) => (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
                        <img
                            key={image}
                            src={getSrc(image)}
                            onClick={this.selectImage(image)}
                            alt=""
                        />
                    ))}
                    <SettersBlock
                        className={style.setters}
                        setters={SETTERS}
                        setHandler={this.handleChange}
                    />
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
