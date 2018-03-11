import React, { Component } from 'react'
import { Connector, Input, SettersBlock } from 'state-control'
import _ from 'lodash'
import DragAndDrop from './DropImage'
import { IDS, IMAGES, SETTERS, THROBBER } from '../constants'
import { getImageFromSrc, PROCESSORS } from '../utils/utils'
import { toRGB } from '../utils/image-processing'
import style from './RGBFilter.css'

export default class RGBFilter extends Component {
    state = { ...SETTERS.Animated }

    componentDidMount () {
        this.selectImage(IMAGES[0])()
    }

    shouldComponentUpdate (nextProps, nextState) {
        return !_.isEqual(
            this.getParameters(nextState),
            this.getParameters()
        )
    }

    getDivider = ({ image, limit, multiplier } = this.state) => {
        const maxSize = Math.max(image.width, image.height)
        const realLimit = limit / multiplier / 3

        return maxSize / realLimit
    }

    getParameters = ({ image, limit, noise, frames, delay, multiplier } = this.state) => (
        !image
            ? { isTheSame: false }
            : {
                image: image.src,
                divider: this.getDivider({ image, limit, multiplier }),
                noise,
                frames,
                delay,
                multiplier,
            }
    )

    handleDrop = (image) => {
        this.setState({ image })
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: Math.round((PROCESSORS[name] || ((v) => v))(value)),
        })
    }

    selectImage = (sample) => () => {
        getImageFromSrc(sample).then((image) => {
            this.setState({ image })
        })
    }

    render () {
        const { image } = this.state
        if (this.image && image) {
            this.image.src = THROBBER
            toRGB({
                ...this.getParameters(),
                image,
            }).then((src) => {
                this.image.src = src
            })
        }

        return (
            <div>
                <DragAndDrop
                    onDrop={this.handleDrop}
                    text="Or drag and drop your image anywhere on the page"
                />
                <div className={style.controls}>
                    <SettersBlock
                        className={style.setters}
                        setters={SETTERS}
                        setHandler={this.handleChange}
                    />
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
                        {this.state.frames > 1 &&
                        <Input
                            id={IDS.delay}
                            label="Delay:"
                            step={50}
                        />}
                    </Connector>
                </div>
                <div className={style.samples}>
                    <p>Or select one of samples:</p>
                    {_.map(IMAGES, (sample) => (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
                        <img
                            key={sample}
                            src={sample}
                            onClick={this.selectImage(sample)}
                            alt=""
                        />
                    ))}
                </div>
                <div className={style.animation}>
                    <img
                        ref={(e) => { this.image = e }}
                        alt=""
                    />
                    <p>Do right click on image and „Save image as...“</p>
                </div>
            </div>
        )
    }
}
