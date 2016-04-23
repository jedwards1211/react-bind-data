/* @flow */

import Immutable from 'immutable';

export default function autobindReducer(state: mixed, action: mixed): mixed {
  if (action instanceof Object && action.meta && action.meta.autobindField) {
    let {payload, meta: {reduxPath, autobindPath, autobindField}} = action;
    if (!(state instanceof Immutable.Collection)) return state;
    return state.setIn([...(reduxPath || []), ...(autobindPath || []), autobindField], payload);
  }
  return state;
}
