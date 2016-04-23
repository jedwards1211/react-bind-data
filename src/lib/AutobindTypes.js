/* @flow */

import type {Key} from '../flowtypes/commonTypes';
export type OnAutobindFieldChange =
  (autobindField: Key, newValue: mixed, options?: {autobindPath?: mixed[]}) => any;
