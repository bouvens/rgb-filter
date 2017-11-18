import React from 'react'
import PropTypes from 'prop-types'

const INITIAL_CANVAS_SIZE = 10

export default class Canvas extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        imageSmoothingEnabled: PropTypes.bool,
        multiplier: PropTypes.number,
        image: PropTypes.object,
        className: PropTypes.string,
    }

    static defaultProps = {
        width: this.width,
        height: this.height,
        imageSmoothingEnabled: true,
        multiplier: 1,
        image: void 0,
        className: '',
    }

    componentDidUpdate () {
        this.paint()
    }

    canvas
    canvasContext
    width = INITIAL_CANVAS_SIZE
    height = INITIAL_CANVAS_SIZE

    paint = () => {
        const { width, height, imageSmoothingEnabled, multiplier, image } = this.props

        if (!image) {
            return
        }

        this.canvas.width = width * multiplier
        this.canvas.height = height * multiplier
        this.canvasContext.imageSmoothingEnabled = imageSmoothingEnabled
        this.canvasContext.scale(multiplier, multiplier)
        this.canvasContext.drawImage(image, 0, 0)
    }

    refCanvas = (elem) => {
        this.canvas = elem
        if (elem) {
            this.canvasContext = elem.getContext('2d')
        }
    }

    render () {
        return (
            <canvas
                ref={this.refCanvas}
                className={this.props.className}
            >
                {'You are using an outdated browser without support of canvas elements.'}
            </canvas>
        )
    }
}
