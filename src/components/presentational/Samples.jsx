import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { SAMPLE_IMAGE_PATHS } from '../../logic'
import style from './style.css'

const Samples = ({ selectImage }) => (
  <div className={style.samples}>
    <p>Or select one of samples:</p>
    {SAMPLE_IMAGE_PATHS.map((sample) => (
      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
      <img
        key={sample}
        src={sample}
        onClick={selectImage(sample)}
        alt="Sample"
      />
    ))}
  </div>
)

Samples.propTypes = {
  selectImage: PropTypes.func,
}

Samples.defaultProps = {
  selectImage: _.noop,
}

export default Samples
