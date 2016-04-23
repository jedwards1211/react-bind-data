/* @flow */

import type {Dispatch} from '../flowtypes/reduxTypes';

import type {OnAutobindFieldChange} from './AutobindTypes';

import {setField} from './AutobindActions';

/**
 * Creates an onAutobindFieldChange callback that dispatches corresponding actions to a redux store.
 *
 * dispatch: a redux dispatch function
 * options.meta: meta to add to the actions dispatched action.
 */
export default function dispatchAutobindFieldChanges(dispatch: Dispatch, 
                                                     options?: {meta?: Object, actionTypePrefix?: string})
: OnAutobindFieldChange {
  let {meta, actionTypePrefix} = options || {};
  return (autobindField, newValue, options) => {
    dispatch(setField(autobindField, newValue, {...options, meta, actionTypePrefix}));
  }
}
