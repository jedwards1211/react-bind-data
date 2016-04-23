/* eslint-disable no-console */

import React, {Component} from 'react';
import _ from 'lodash';

export default class AutobindSandbox extends Component {
  constructor(props) {
    super(props);
    this.state = props.initState || {};
  }
  onAutobindFieldChange = (field, newValue, options) => {
    console.log('autobind field change: ', field, newValue, options);
    if (options && options.autobindPath) {
      this.setState(_.set(_.cloneDeep(this.state), [...options.autobindPath, field], newValue));
    }
    else {
      this.setState({[field]: newValue});
    }
  };
  render() {
    let {children} = this.props;
    let {onAutobindFieldChange} = this;
    
    return React.cloneElement(children, {
      ...this.state,
      onAutobindFieldChange
    });
  }
}
