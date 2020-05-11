import React from 'react'
import PropTypes from 'prop-types'
import { Check, Connector, Input, SettersBlock } from 'state-control'
import _ from 'lodash'
import { IDS, SETTERS } from '../../logic'
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
      <Check
        id={IDS.rgbSplit}
        label="Split RGB"
        type="boolean"
        className={style.check}
      />
      <Check
        id={IDS.eightBit}
        label="8-bit color"
        type="boolean"
        className={style.check}
      />
      {state[IDS.rgbSplit] && (
        <Input
          id={IDS.multiplier}
          label="Pixelization:"
        />
      )}
      {!state[IDS.rgbSplit] && (
        <Check
          id={IDS.discreteStripes}
          label="Discrete stripes"
          type="boolean"
          className={style.check}
        />
      )}
      {!state[IDS.rgbSplit] && (
        <Input
          id={IDS.stripes}
          label="Stripes:"
          step={10}
        />
      )}
      {!state[IDS.rgbSplit] && state[IDS.stripes] > 0 && (
        <Input
          id={IDS.stripesStrength}
          label="Stripes strength:"
          step={5}
        />
      )}
      <Input
        id={IDS.sizeLimit}
        label="Size limit:"
        step={100}
      />
      <Input
        id={IDS.noise}
        label="Color noise:"
      />
      {state[IDS.noise] > 0 && (
        <Input
          id={IDS.noiseSize}
          label="Noise pixel:"
        />
      )}
      <Input
        id={IDS.frames}
        label="Frames:"
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
  state: PropTypes.shape({
    ..._.reduce(IDS, (all, item) => ({
      ...all,
      [item]: PropTypes.number,
    }), {}),
    [IDS.rgbSplit]: PropTypes.bool,
    [IDS.eightBit]: PropTypes.bool,
    [IDS.discreteStripes]: PropTypes.bool,
  }).isRequired,
  handleChange: PropTypes.func,
}

Controls.defaultProps = {
  handleChange: _.noop,
}

export default Controls
