/* eslint-disable no-console */

/**
 * Similar to fbjs warning but just passes arguments directly to console.error
 * so that you can log JS trees and the developer can inspect them.
 */

const __DEV__ = process.env.NODE_ENV !== 'production';

let warning = function() {};

if (__DEV__) {
  warning = function(condition, ...args) {
    if (!args.length) {
      throw new Error(
        '`warning(condition, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (!condition) {
      if (typeof console !== 'undefined') {
        console.error(...args);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(...args);
      } catch(x) {
        // ignore
      }
    }
  };
}

export default warning;
