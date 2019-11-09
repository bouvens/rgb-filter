import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import style from './DropImage.css'

const BodyPortal = ({ children }) => createPortal(children, document.body)

export default class DropImage extends Component {
  static propTypes = {
    onDrop: PropTypes.func,
    text: PropTypes.string,
  }

  static defaultProps = {
    onDrop: _.noop,
    text: 'Or drag an image on the page',
  }

  state = {
    output: '',
    isDragOver: false,
    isFileLoading: false,
  }

  constructor (props) {
    super(props)

    this.file = new FileReader()
    this.file.onload = this.onFileLoad
    this.file.onerror = this.onError

    this.img = new Image()
    this.img.onload = this.onImageLoad
    this.img.onerror = this.onError
    this.img.crossOrigin = 'Anonymous'
  }

  componentDidMount () {
    document.addEventListener('dragover', this.handleDragOver)
    document.addEventListener('dragenter', this.handleDragEnter)
    document.addEventListener('drop', this.handleFileSelect)
  }

  onFileLoad = ({ target }) => {
    this.img.src = target.result
  }

  onError = () => {
    this.setState({
      isFileLoading: false,
      output: 'Try another image, please. If this is an image from other website try to save it locally before dragging.',
    })
  }

  onImageLoad = ({ target }) => {
    this.setState({ isFileLoading: false, output: '' })
    this.props.onDrop(target)
  }

  handleDragOver = (evt) => {
    const { dataTransfer } = evt
    dataTransfer.dropEffect = 'copy' // explicitly show this is a copy
    evt.stopPropagation()
    evt.preventDefault()
  }

  handleDragEnter = () => {
    this.setState({ isDragOver: true })
  }

  handleDragLeave = () => {
    this.setState({ isDragOver: false })
  }

  readAsData = (file) => {
    try {
      this.file.readAsDataURL(file)
    } catch (e) {
      this.onError(e)
    }
  }

  handleFileSelect = (evt) => {
    this.setState({
      isDragOver: false,
      isFileLoading: true,
    })

    evt.stopPropagation()
    evt.preventDefault()

    const { files } = evt.dataTransfer
    const file = files.item(0)
    const link = evt.dataTransfer.getData('text')

    let output

    if (_.isEmpty(files) && evt.dataTransfer.getData('text')) {
      output = ''
      this.img.src = link
    } else {
      output = (
        <li key={file.name}>
          {`${file.name} (${file.type || 'n/a'}) - ${file.size} bytes`}
        </li>
      )
    }
    this.setState({ output })

    this.readAsData(file)
  }

  handleFile = ({ target: { files } }) => {
    this.readAsData(files.item(0))
  }

  render () {
    return (
      <div>
        <div className={style.header}>
          <input type="file" onChange={this.handleFile} />
          {this.props.text}
        </div>
        <div className={style.output}>{this.state.output}</div>
        <BodyPortal>
          {this.state.isDragOver
          && (
            <div className={style.bodyHover} onDragLeave={this.handleDragLeave}>
              Drop it!
            </div>
          )}
          {this.state.isFileLoading
          && (
            <div className={style.bodyHover}>
              Loading...
            </div>
          )}
        </BodyPortal>
      </div>
    )
  }
}
