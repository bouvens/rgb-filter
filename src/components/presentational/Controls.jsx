import React from 'react'
import PropTypes from 'prop-types'
import { Connector, Input, SettersBlock } from 'state-control'
import _ from 'lodash'
import { IDS, SETTERS } from '../../common'
import style from './style.css'

const Controls = ({ state, handleChange }) => (
  <div className={style.controls}>
    <SettersBlock
      className={style.setters}
      setters={SETTERS}
      setHandler={handleChange}
    />
    <Connector
      state={state}
      onChange={handleChange}
      type="number"
    >
      <Input
        id={IDS.multiplier}
        label="Pixelization:"
      />
      <Input
        id={IDS.sizeLimit}
        label="Size limit:"
        step={200}
      />
      <Input
        id={IDS.noise}
        label="Color noise:"
        step={1}
      />
      <Input
        id={IDS.frames}
        label="Frames:"
        step={1}
      />
      {state[IDS.frames] > 1
      && (
        <Input
          id={IDS.delay}
          label="Delay:"
          step={100}
        />
      )}
    </Connector>
  </div>
)

Controls.propTypes = {
  state: PropTypes.shape(_.reduce(IDS, (all, item) => ({
    ...all,
    [item]: PropTypes.number,
  }), {})).isRequired,
  handleChange: PropTypes.func,
}

Controls.defaultProps = {
  handleChange: _.noop,
}

export default Controls
