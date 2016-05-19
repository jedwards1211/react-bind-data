/* @flow */

import React, {Component, Children, PropTypes} from 'react'
import get from 'lodash.get'
import upperFirst from 'lodash.upperfirst'
import warning from './util/warning'

type DefaultProps = {
  data: Object,
  getInData: (data: any, path: any[]) => mixed,
  getInMetadata: (metadata: any, path: any[]) => mixed,
  onFieldChange: (path: any[], newValue: any) => any,
};

type Props = {
  data: mixed,
  getInData: (data: any, path: any[]) => mixed,
  metadata?: Object,
  getInMetadata: (metadata: any, path: any[]) => mixed,
  omnidata?: Object,
  onFieldChange: (path: any[], newValue: any) => any,
  children?: mixed,
};

export default class BindData extends Component<DefaultProps, Props, void> {
  static propTypes = {
    data: PropTypes.any,
    getInData: PropTypes.func,
    metadata: PropTypes.object,
    getInMetadata: PropTypes.func,
    omnidata: PropTypes.object,
    onFieldChange: PropTypes.func,
    children: PropTypes.any.isRequired
  };

  static defaultProps = {
    data: {},
    getInData: get,
    getInMetadata: get,
    onFieldChange() {}
  };

  bindFields(children: any, path?: any[] = []): any[] {
    let {data, getInData, metadata, getInMetadata, onFieldChange, omnidata} = this.props

    let anyValid = false

    const result = Children.map(children, (child: mixed) => {
      if (React.isValidElement(child) && child instanceof Object && child.props) {
        anyValid = true
        let {children, bindDataProps, name} = (child.props: Object)

        if ('production' !== process.env.NODE_ENV) {
          warning(name == null ||
              typeof name === 'string' || typeof name === 'number' ||
              // flow-issue(react-bind-data)
              typeof name === 'symbol' || name instanceof Array,
            "props.name should be a string or number in descendant: ", child)

          warning(bindDataProps == null || bindDataProps instanceof Object,
            "props.bindDataProps should be an Object in descendant: ", child)

          if (bindDataProps instanceof Object) {
            for (let prop in bindDataProps) {
              let name = bindDataProps[prop]
              warning(name == null ||
                typeof name === 'string' || typeof name === 'number' ||
                // flow-issue(react-bind-data)
                typeof name === 'symbol' || name instanceof Array,
                `props.bindDataProps[${prop}] should be a string, number, Symbol, or Array in descendant: `, child)
            }
          }
        }

        let newProps = {}
        Object.assign(newProps, omnidata)

        if (name) bindDataProps = Object.assign({}, bindDataProps, {value: name})
        if (bindDataProps) {
          for (let prop in bindDataProps) {
            let name = bindDataProps[prop]

            let propPath = path.concat(name)
            for (let prop in metadata) {
              let metadataProp = getInMetadata(metadata[prop], propPath)
              if (metadataProp != null) newProps[prop] = metadataProp
            }
            newProps[prop] = getInData(data, propPath)

            if (prop === 'value') {
              let wrappedOnChange = child.props.onChange
              newProps.onChange = (e:any) => {
                wrappedOnChange && wrappedOnChange(e)
                if (e && e.stopPropagation) e.stopPropagation()
                onFieldChange(propPath, e && e.target ? e.target.value : e)
              }
            }
            else {
              let onChange = `on${upperFirst(prop)}Change`
              let wrappedOnChange = child.props[onChange]
              newProps[onChange] = (newValue, ...args) => {
                wrappedOnChange && wrappedOnChange(newValue, ...args)
                onFieldChange(propPath, newValue)
              }
            }
          }
        }

        if (children) {
          let childPath = name instanceof Array || name != null ? path.concat(name) : path
          newProps.children = this.bindFields(children, childPath)
        }

        return React.cloneElement(child, newProps)
      }
      return child
    })

    return anyValid ? result : children
  }

  render(): React.Element {
    return this.bindFields(this.props.children)[0]
  }
}

