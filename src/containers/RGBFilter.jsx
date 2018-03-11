import React, { Component } from 'react'
import DragAndDrop from '../components/DropImage'
import { Controls, Samples, Animation } from '../presentational'
import { IMAGES, SETTERS, THROBBER } from '../constants'
import { getImageFromSrc, PROCESSORS, toRGB } from '../utils'

export default class RGBFilter extends Component {
    state = { ...SETTERS.Animated }

    componentDidMount () {
        this.selectImage(IMAGES[0])()
    }

    getDivider = ({ image, limit, multiplier } = this.state) => {
        const maxSize = Math.max(image.width, image.height)
        const realLimit = limit / multiplier / 3

        return maxSize / realLimit
    }

    setImageRef = (e) => {
        this.image = e
    }

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
        const { image, limit, noise, frames, delay, multiplier } = this.state
        if (this.image && image) {
            this.image.src = THROBBER
            toRGB({
                divider: this.getDivider({ image, limit, multiplier }),
                noise,
                frames,
                delay,
                multiplier,
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
                <Controls
                    state={this.state}
                    handleChange={this.handleChange}
                />
                <Samples selectImage={this.selectImage} />
                <Animation setImageRef={this.setImageRef} />
            </div>
        )
    }
}
