import React, { Component } from 'react'
import { Connector, Input, SettersBlock } from 'state-control'
import DragAndDrop from './DropImage'
import Canvas from './Canvas'
import { IDS, SETTERS } from './constants'
import { toRGB } from '../image-processing'
import style from './RGBFilter.css'

export default class RGBFilter extends Component {
    static defaultProps = {
        ...SETTERS.Default,
    }

    constructor (props) {
        super(props)

        this.state = { ...this.props }
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
            return {}
        }

        return toRGB(image, this.state.divider)
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
