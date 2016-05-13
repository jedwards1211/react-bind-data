/* eslint-disable no-console */

import React, {Component, PropTypes} from 'react'
import set from 'lodash.set'
import cloneDeep from 'lodash.clonedeep'

export default class BindDataSandbox extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    initState: PropTypes.object
  };
  constructor(props) {
    super(props)
    this.state = props.initState || {}
  }
  onFieldChange = (fieldPath, newValue) => {
    console.log('onFieldChange: ', fieldPath, newValue)
    if (fieldPath) {
      this.setState(set(cloneDeep(this.state), fieldPath, newValue))
    }
  };
  render() {
    let {children} = this.props
    let {onFieldChange} = this

    return React.cloneElement(children, {
      ...this.state,
      onFieldChange
    })
  }
}
