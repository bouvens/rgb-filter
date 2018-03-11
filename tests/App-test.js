import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import RGBFilter from 'src/containers/RGBFilter'

describe('RGBFilter component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    render(<RGBFilter/>, node, () => {
      expect(node.textContent).toContain('Welcome to React')
    })
  })
})
