/* @flow */

import _get from 'lodash.get'
import toPath from 'lodash.topath'
import upperFirst from 'lodash.upperfirst'
import assign from 'lodash.assign'
import mapValues from 'lodash.mapvalues'

type BoundData = {
  (fields: any): Object,
  sub: (path: any) => BoundData
}

export default function bindData(options?: {
  data?: any,
  get?: (data: any, path: string | any[]) => any,
  metadata?: Object,
  omnidata?: Object,
  onFieldChange?: (path: any[], newValue: any) => any
} = {}): BoundData {
  const {data, metadata, omnidata, onFieldChange} = options

  const get = options.get || _get

  function getData(fields: any): Object {
    const result = {}
    if (omnidata) assign(result, omnidata)

    if (!(fields instanceof Object) || Array.isArray(fields)) fields = {value: fields}

    for (var prop in fields) {
      const path = toPath(fields[prop])
      if (data) result[prop] = get(data, path)
      for (var metaprop in metadata) {
        const metavalue = get(metadata[metaprop], path)
        if (metavalue != null) result[metaprop] = metavalue
      }
      if (onFieldChange) {
        const event = prop === 'value' ? 'onChange' : `on${upperFirst(prop)}Change`
        result[event] = e => {
          if (e && e.target instanceof Object) onFieldChange(path, e.target.value)
          else onFieldChange(path, e)
        }
      }
    }

    return result
  }

  getData.sub = function sub(_path: any) {
    const path = toPath(_path)

    return bindData({
      data: get(data, path),
      metadata: mapValues(metadata, tree => get(tree, path)),
      omnidata,
      onFieldChange: onFieldChange && ((subpath, newValue) => onFieldChange([...path, ...subpath], newValue))
    })
  }

  return getData
}
