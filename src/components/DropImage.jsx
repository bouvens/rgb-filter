import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import style from './DropImage.css'

export default class DropImage extends Component {
    static propTypes = {
        onDrop: PropTypes.func,
        defaultImage: PropTypes.string,
    }
    static defaultProps = {
        onDrop: _.noop,
        defaultImage: '',
    }

    constructor (props) {
        super(props)

        this.state = {
            output: '',
        }

        this.file = new FileReader()
        this.file.onload = this.onFileLoad
        this.file.onerror = this.onError

        this.img = new Image()
        this.img.onload = this.onImageLoad
        this.img.onerror = this.onError
        this.img.src = this.props.defaultImage
    }

    componentDidMount () {
        document.addEventListener('dragover', this.handleDragOver)
        // document.addEventListener('dragenter', this.handleDragOver)
        // document.addEventListener('dragleave', this.handleDragOver)
        document.addEventListener('drop', this.handleFileSelect)
    }

    onFileLoad = ({ target }) => {
        this.img.src = target.result
    }

    onError = () => {
        this.setState({ output: 'Try another image, please.' })
    }

    onImageLoad = ({ target }) => {
        this.props.onDrop(target)
    }

    handleFileSelect = (evt) => {
        evt.stopPropagation()
        evt.preventDefault()

        const { files } = evt.dataTransfer

        const output = _.map(files, (f) => (
            <li key={f.name}>
                <strong>{f.name}</strong>{` (${f.type || 'n/a'}) - ${f.size} bytes`}
            </li>
        ))

        this.file.readAsDataURL(files[0])

        this.setState({ output })
    }

    handleDragOver = (evt) => {
        const { dataTransfer } = evt
        dataTransfer.dropEffect = 'copy' // explicitly show this is a copy
        evt.stopPropagation()
        evt.preventDefault()
    }

    render () {
        return (
            <div>
                <div key="zone" className={style.dropZone}>
                    Drop file anywhere on page
                </div>
                <div key="output">{this.state.output}</div>
            </div>
        )
    }
}
