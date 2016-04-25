# react-bind-data

```jsx
import BindData from 'react-bind-data';
```

(work in progress)

## How it works

`BindData` recursively clones it children.  For each that has a `name` prop, it injects `value={data[name]}` and an
`onChange` handler that will call the `BindData`'s `onFieldChange` prop.  For each that has a `bindDataProps` prop,
it will inject `<key>={data[bindDataProps[<key>]]}` and an `on<Key>Change` handler.

When nested components with `name` props are given, it treats them as a path and uses the value from `data`
at that path.  So in the following, `BindData` will inject `value={_.get(data, ['address', 'city'])}`:

```jsx
<BindData data={data} onFieldChange={...}>
  <fieldset name="address">
    <input name="city" type="text"/>
  </fieldset>
</BindData>
```

This means it works naturally with forms.  However, you can use it with any elements -- just put `name` or
`bindDataProps` on those elements, even if they don't use those properties themselves.

Since it recursively clones its children, it can't look inside children that are higher order components.  However,
it doesn't prevent you from passing in props manually in cases where `BindData` is unable to do so itself.

## More boilerplate/Redux integration

(coming soon)

Any time a bound component calls its `onChange`, `BindData` calls its `onFieldChange` with the path within `data`
that was changed and the new value.  This project will provide a cookie-cutter `onFieldChange` handler that dispatches
Redux actions and Redux reducers that handle those events for POJO and Immutable.js state trees.  There is also a
`BindDataSandbox` component for testing your form during development that handles the state updates itself.

## Example

`BindData` will automatically inject `value` props from `data`, and (in this case) `validation` props from
`metadata.validation`, based upon the path of `name` props.

It will also pass in `onChange` handlers to the inputs, and it will call `onFieldChange`.  If the city of
the first address is changed to 'Austin', for instance, it will call
`onFieldChange(['addresses', 0, 'city'], 'Austin')`.

```jsx
  import React from 'react';
  import ReactDOM from 'react-dom';

  import BindData from 'react-bind-data';

  let data = {
    name: {
      firstName: 'Andy',
      lastName: 'Edwards'
    },
    addresses: [
      {
        line1: '5 Five Way',
        city: 'Fivedom'
      }
    ]
  };
  let metadata = {
    validation: {
      name: {
        firstName: 'first name is OK!',
        lastName: 'last name is OK!'
      },
      addresses: [
        {
          line1: 'line1 is OK!',
          city: 'city is OK!'
        }
      ]
    }
  };

  function onFieldChange() { console.log(...arguments); }

  ReactDOM.render(<BindData data={data} metadata={metadata} onFieldChange={onFieldChange}>
    <form>
      <fieldset name="name">
        <input type="text" name="firstName" placeholder="First Name"/>
        <input type="text" name="lastName"  placeholder="Last Name"/>
      </fieldset>
      <fieldset name="addresses">
        <fieldset name={0}>
          <input type="text" name="line1" placeholder="Line 1"/>
          <input type="text" name="city"  placeholder="City"/>
        </fieldset>
      </fieldset>
    </form>
  </BindData>, document.getElementById('root'));
```
