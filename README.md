# react-bind-data

(work in progress)

## How it works

`BindData` recursively clones it children looking for those with a `name` prop or `bindDataProps` prop.  When nested
components with `name` props are given, it treats them as a path and uses the value from `data` at that path.

Since it recursively clones its children, it can't look inside children that are higher order components.  However,
it doesn't prevent you from passing in props manually in cases where `BindData` is unable to do so itself.

## Example

`BindData` will automatically inject `value` props from `data`, and `validation` props from
`metadata.validation`, based upon the path of `name` props.

It will also pass in `onChange` handlers to the inputs, and it will call `onFieldChange`.  If the city of
the first address is changed to 'Austin', for instance, it will call
`onFieldChange(['addresses', 0, 'city'], 'Austin')`.


```jsx
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

  const Form = () => <BindData data={data} metadata={metadata} onFieldChange={onFieldChange}>
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
  </BindData>;
```
