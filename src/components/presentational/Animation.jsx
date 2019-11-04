import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import style from './style.css'

const Animation = ({ setImageRef }) => (
  <div className={style.animation}>
    <img
      ref={setImageRef}
      alt=""
    />
    <p>Do right click on image and „Save image as...“</p>
  </div>
)

Animation.propTypes = {
  setImageRef: PropTypes.func,
}

Animation.defaultProps = {
  setImageRef: _.noop,
}

export default Animation
