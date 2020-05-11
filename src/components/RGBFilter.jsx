import React, { Component } from 'react'
import {
  getImageFromSrc,
  IDS,
  PARAMETER_PROCESSORS,
  SAMPLE_IMAGE_PATHS,
  SETTERS,
  THROBBER,
  toRGB,
} from '../logic'
import DragAndDrop from './DropImage'
import { Animation, Controls, Samples } from './presentational'

export default class RGBFilter extends Component {
  state = {
    ...SETTERS[Object.keys(SETTERS)[0]],
    error: null,
  }

  componentDidMount () {
    this.handleSelectImage(SAMPLE_IMAGE_PATHS[0])()
  }

  componentDidUpdate () {
    const { image } = this.state
    if (this.image && image) {
      this.image.src = THROBBER
      toRGB(this.state)
        .then((src) => {
          this.image.src = src
          if (this.state.error) {
            this.setState({ error: null })
          }
        })
        .catch((error) => {
          if (!this.state.error) {
            this.setState({ error: error.toString() })
          }
        })
    }
  }

  setImageRef = (e) => {
    this.image = e
  }

  handleDrop = (image) => {
    this.setState({ image })
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: (PARAMETER_PROCESSORS[name] || ((v) => v))(value),
    })
  }

  handleSelectImage = (sample) => () => {
    getImageFromSrc(sample).then((image) => {
      this.setState({ image })
    })
  }

  render () {
    return (
      <>
        <DragAndDrop
          onDrop={this.handleDrop}
          text="Or drag and drop your image anywhere on the page"
        />
        <Controls
          state={this.state}
          handleChange={this.handleChange}
        />
        <Samples selectImage={this.handleSelectImage} />
        <div
          style={{
            minHeight: this.state[IDS.sizeLimit],
            visibility: this.image ? 'visible' : 'hidden',
          }}
        >
          <Animation setImageRef={this.setImageRef} error={this.state.error} />
        </div>
      </>
    )
  }
}
