import React from 'react'
import {mount} from 'enzyme'

import HelloWorld from '../src/index'

describe('HelloWorld', () => {
  it("can be rendered", () => {
    let comp = mount(<HelloWorld />)
    expect(comp.text().toLowerCase()).toBe('hello world!')
  })
})
