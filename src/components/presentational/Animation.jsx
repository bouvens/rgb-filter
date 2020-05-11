import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import style from './style.css'

const Animation = ({ setImageRef, error }) => (
  <div className={style.animation}>
    {error
      ? <div className={style.error}>{error}</div>
      : <p>Do right click on the image and select “Save image as...”</p>}
    <img
      ref={setImageRef}
      alt="Generated animation"
    />
  </div>
)

Animation.propTypes = {
  setImageRef: PropTypes.func,
  error: PropTypes.string,
}

Animation.defaultProps = {
  setImageRef: _.noop,
  error: '',
}

export default Animation
